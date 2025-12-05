// Midtrans Payment - Generate Snap Token
// This Edge Function creates a Midtrans transaction and returns the Snap token

// @ts-ignore - Deno runtime types
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from '@supabase/supabase-js'

// @ts-ignore - Deno runtime
const MIDTRANS_SERVER_KEY = Deno.env.get('MIDTRANS_SERVER_KEY')
const MIDTRANS_API_URL = "https://app.sandbox.midtrans.com/snap/v1/transactions"
// @ts-ignore - Deno runtime
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
// @ts-ignore - Deno runtime
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

if (!MIDTRANS_SERVER_KEY) {
    throw new Error('MIDTRANS_SERVER_KEY environment variable is required')
}

// CORS Headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

// @ts-ignore - Deno runtime
Deno.serve(async (req: Request) => {
    // Handle CORS Preflight Request
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            status: 200,
            headers: corsHeaders
        })
    }

    try {
        // ✅ STEP 1: AUTH CHECK - Get authorization header
        const authHeader = req.headers.get('authorization')
        console.log('Authorization header present:', !!authHeader)

        // Initialize Supabase client for auth check
        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        
        // For authenticated users - verify token and get user
        let userId: string | null = null
        let userEmail: string | null = null

        if (authHeader) {
            // Extract token from "Bearer <token>"
            const token = authHeader.replace('Bearer ', '')
            
            // Verify user session
            const { data: { user }, error: authError } = await supabase.auth.getUser(token)
            
            if (authError || !user) {
                console.error('Auth verification failed:', authError)
                // Allow anonymous payment (payment-first flow)
                console.log('⚠️ Anonymous payment - user will need to signup after')
            } else {
                userId = user.id
                userEmail = user.email || null
                console.log('✅ Authenticated user:', { userId, email: userEmail })
            }
        } else {
            console.log('⚠️ No auth header - anonymous payment flow')
        }

        // ✅ STEP 2: VALIDATE INPUT
        const { email, amount, item_name } = await req.json()

        console.log('Request received:', { email, amount, item_name, hasUserId: !!userId })
        console.log('Server Key available:', !!MIDTRANS_SERVER_KEY)

        // Use authenticated user's email or provided email
        const customerEmail = userEmail || email

        // Validate email and amount
        if (!customerEmail || !amount) {
            return new Response(
                JSON.stringify({ error: 'Email and amount are required' }),
                { 
                    status: 400, 
                    headers: { 
                        ...corsHeaders,
                        'Content-Type': 'application/json'
                    } 
                }
            )
        }

        // Validate email format
        if (!customerEmail.includes('@') || customerEmail.length < 5) {
            return new Response(
                JSON.stringify({ error: 'Invalid email format' }),
                { 
                    status: 400, 
                    headers: { 
                        ...corsHeaders,
                        'Content-Type': 'application/json'
                    } 
                }
            )
        }

        // ✅ STEP 3: CREATE ORDER IN DATABASE (before Midtrans call)
        console.log('Step 3: Creating order record in database...')
        
        const orderId = `MAHIR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        
        const { data: orderData, error: insertError } = await supabase
            .from('orders')
            .insert({
                order_id: orderId,
                user_id: userId, // Will be null for anonymous payment
                email: customerEmail,
                gross_amount: amount,
                transaction_status: 'pending',
                created_at: new Date().toISOString()
            })
            .select()
            .single()

        if (insertError) {
            console.error('❌ Failed to create order record:', insertError)
            return new Response(
                JSON.stringify({ 
                    error: 'Failed to create order record',
                    details: insertError.message
                }),
                {
                    status: 500,
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json'
                    }
                }
            )
        }

        console.log('✅ Order created in database:', orderData)

        // ✅ STEP 4: PREPARE MIDTRANS TRANSACTION
        const transactionData = {
            transaction_details: {
                order_id: orderId,
                gross_amount: amount
            },
            customer_details: {
                email: customerEmail,
                first_name: customerEmail.split('@')[0] || 'User'
            },
            item_details: [
                {
                    id: 'mahir-arab-premium',
                    price: amount,
                    quantity: 1,
                    name: item_name || 'Mahir Arab - Akses Premium'
                }
            ],
            callbacks: {
                finish: `${req.headers.get('origin')}/app/`
            }
        }

        // ✅ STEP 5: CALL MIDTRANS API
        const midtransAuthHeader = 'Basic ' + btoa(MIDTRANS_SERVER_KEY + ':')
        console.log('Midtrans auth header created, Server Key prefix:', MIDTRANS_SERVER_KEY.substring(0, 10))

        const response = await fetch(MIDTRANS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': midtransAuthHeader
            },
            body: JSON.stringify(transactionData)
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('❌ Midtrans API Error:', {
                status: response.status,
                statusText: response.statusText,
                data: data
            })
            
            // Update order status to 'failure'
            await supabase
                .from('orders')
                .update({ 
                    transaction_status: 'failure',
                    midtrans_response: data
                })
                .eq('order_id', orderId)
            
            return new Response(
                JSON.stringify({ 
                    error: 'Failed to create transaction', 
                    details: data,
                    status: response.status,
                    message: data.error_messages || data.message || 'Unknown error',
                    debug: {
                        api_url: MIDTRANS_API_URL,
                        has_server_key: !!MIDTRANS_SERVER_KEY
                    }
                }),
                {
                    status: response.status,
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json'
                    }
                }
            )
        }

        // ✅ STEP 6: UPDATE ORDER WITH SNAP TOKEN
        console.log('Step 6: Updating order with snap_token...')
        
        const { error: updateError } = await supabase
            .from('orders')
            .update({
                snap_token: data.token,
                midtrans_response: data,
                updated_at: new Date().toISOString()
            })
            .eq('order_id', orderId)

        if (updateError) {
            console.error('⚠️ Failed to update snap_token:', updateError)
            // Continue anyway, we have the token
        } else {
            console.log('✅ Order updated with snap_token')
        }

        // ✅ STEP 7: RETURN RESPONSE
        console.log('✅ Payment creation successful!')
        
        return new Response(
            JSON.stringify({
                success: true,
                snap_token: data.token,
                order_id: orderId,
                redirect_url: data.redirect_url,
                authenticated: !!userId
            }),
            {
                status: 200,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            }
        )

    } catch (error: any) {
        console.error('Payment function error:', error.message)
        return new Response(
            JSON.stringify({ 
                error: error.message || 'Internal server error'
            }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            }
        )
    }
})
