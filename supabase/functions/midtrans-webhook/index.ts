// Midtrans Webhook Handler
// This Edge Function processes payment notifications from Midtrans

// @ts-ignore - Deno runtime types
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from '@supabase/supabase-js'

// @ts-ignore - Deno runtime
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
// @ts-ignore - Deno runtime
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Dynamic environment detection
// @ts-ignore - Deno runtime
const IS_PRODUCTION = Deno.env.get('IS_PRODUCTION') === 'true'

// Dynamic server key based on environment
// @ts-ignore - Deno runtime
const MIDTRANS_SERVER_KEY = IS_PRODUCTION 
    // @ts-ignore - Deno runtime
    ? Deno.env.get('PROD_SERVER_KEY')
    // @ts-ignore - Deno runtime
    : Deno.env.get('SB_SERVER_KEY')

console.log('🔧 Webhook Environment:', {
    isProduction: IS_PRODUCTION,
    hasServerKey: !!MIDTRANS_SERVER_KEY,
    serverKeyPrefix: MIDTRANS_SERVER_KEY?.substring(0, 11)
})

// Helper: Generate Midtrans SHA-512 signature for verification
async function generateSignature(
    orderId: string,
    statusCode: string,
    grossAmount: string,
    serverKey: string
): Promise<string> {
    const data = `${orderId}${statusCode}${grossAmount}${serverKey}`
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-512', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
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
        // ✅ STEP 0: Validate required environment variables
        const requiredKey = IS_PRODUCTION ? 'PROD_SERVER_KEY' : 'SB_SERVER_KEY'
        
        if (!MIDTRANS_SERVER_KEY) {
            console.error(`❌ ${requiredKey} not configured! (IS_PRODUCTION=${IS_PRODUCTION})`)
            return new Response(
                JSON.stringify({ 
                    error: 'Server configuration error',
                    details: `${requiredKey} environment variable is required`
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

        console.log('\n=== WEBHOOK RECEIVED ===')
        console.log('Environment:', IS_PRODUCTION ? 'PRODUCTION' : 'SANDBOX')
        console.log('Timestamp:', new Date().toISOString())
        
        const payload = await req.json()
        console.log('Payload received:', JSON.stringify(payload, null, 2))

        const {
            order_id,
            transaction_status,
            fraud_status,
            customer_details,
            signature_key,
            status_code,
            gross_amount,
            payment_type,
            transaction_time,
            expiry_time
        } = payload

        // ✅ SECURITY: Verify Midtrans signature
        if (signature_key && MIDTRANS_SERVER_KEY) {
            console.log('Verifying Midtrans signature...')
            const expectedSignature = await generateSignature(
                order_id,
                status_code,
                gross_amount,
                MIDTRANS_SERVER_KEY
            )
            
            if (signature_key !== expectedSignature) {
                console.error('❌ INVALID SIGNATURE - Possible fraud attempt!')
                console.error('Expected:', expectedSignature)
                console.error('Received:', signature_key)
                return new Response(
                    JSON.stringify({ error: 'Invalid signature' }),
                    { 
                        status: 401,
                        headers: {
                            ...corsHeaders,
                            'Content-Type': 'application/json'
                        }
                    }
                )
            }
            console.log('✅ Signature verified')
        } else {
            console.warn('⚠️ Signature verification skipped (manual trigger or missing server key)')
        }

        const email = customer_details?.email
        console.log('Extracted email:', email)
        console.log('Transaction status:', transaction_status)
        console.log('Fraud status:', fraud_status)

        // ✅ VALIDATION: Email required and format check
        if (!email) {
            console.error('ERROR: Email not found in payload')
            return new Response(
                JSON.stringify({ error: 'Email is required' }),
                { 
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json'
                    }
                }
            )
        }

        if (!email.includes('@') || email.length < 5) {
            console.error('ERROR: Invalid email format:', email)
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

        // Only process successful payments
        const isSuccess = (
            transaction_status === 'capture' ||
            transaction_status === 'settlement'
        ) && fraud_status === 'accept'

        console.log('Is payment successful?', isSuccess)

        if (!isSuccess) {
            console.log('Payment not successful yet, skipping profile update')
            return new Response(
                JSON.stringify({ 
                    message: 'Payment not successful yet',
                    transaction_status,
                    fraud_status
                }),
                { 
                    status: 200,
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json'
                    }
                }
            )
        }

        // Initialize Supabase client
        console.log('Initializing Supabase client...')
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // ✅ IDEMPOTENCY: Check if order already processed successfully
        console.log('Checking idempotency for order:', order_id)
        const { data: existingOrder } = await supabase
            .from('orders')
            .select('transaction_status, webhook_attempts')
            .eq('order_id', order_id)
            .single()

        if (existingOrder && (existingOrder.transaction_status === 'settlement' || existingOrder.transaction_status === 'capture')) {
            console.log('⚠️ Order already processed successfully, skipping duplicate webhook')
            return new Response(
                JSON.stringify({
                    success: true,
                    message: 'Order already processed (idempotent)',
                    order_id,
                    previous_status: existingOrder.transaction_status
                }),
                { 
                    status: 200,
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json'
                    }
                }
            )
        }

        // ✅ STEP 1: Update/Create order record (AUDIT TRAIL)
        console.log('Step 1: Updating order record...')
        console.log('Webhook attempts so far:', existingOrder?.webhook_attempts || 0)

        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .upsert({
                order_id,
                email,
                transaction_status,
                fraud_status,
                payment_type,
                gross_amount: gross_amount ? parseFloat(gross_amount) : 49000, // Default to 49000 if not provided
                midtrans_response: payload,
                webhook_attempts: (existingOrder?.webhook_attempts || 0) + 1,
                updated_at: new Date().toISOString(),
                paid_at: (transaction_status === 'settlement' || transaction_status === 'capture') 
                    ? (transaction_time ? new Date(transaction_time).toISOString() : new Date().toISOString())
                    : null,
                expired_at: expiry_time ? new Date(expiry_time).toISOString() : null
            }, {
                onConflict: 'order_id',
                ignoreDuplicates: false
            })
            .select()

        if (orderError) {
            console.error('❌ Order update error:', orderError)
            throw orderError
        }

        console.log('✅ Order updated/created:', orderData)

        // ✅ STEP 2: Update profile (only if payment successful)
        console.log('Step 2: Checking if profile update needed...')
        console.log('Looking for existing profile by email:', email)
        const { data: existingUser, error: lookupError } = await supabase
            .from('profiles')
            .select('id, email, status')
            .eq('email', email)
            .single()

        if (lookupError) {
            console.log('Profile lookup error (might be normal if profile doesnt exist):', lookupError.message)
        }
        
        if (existingUser) {
            console.log('Found existing profile:', existingUser)
        } else {
            console.log('No existing profile found, will create new one')
        }

        let profileData
        let profileError

        // Calculate subscription expiry date (30 days from now)
        const subscriptionExpiryDate = new Date()
        subscriptionExpiryDate.setDate(subscriptionExpiryDate.getDate() + 30)
        const expiryIso = subscriptionExpiryDate.toISOString()
        console.log('Setting subscription expiry to:', expiryIso)

        if (existingUser) {
            // Update existing user to premium with expiry date
            console.log('Updating existing profile to premium...')
            const result = await supabase
                .from('profiles')
                .update({ 
                    status: 'premium',
                    subscription_expires_at: expiryIso
                })
                .eq('email', email)
                .select()
            profileData = result.data
            profileError = result.error
            console.log('Update result:', { data: profileData, error: profileError })
        } else {
            // Create new profile for user who paid without signup
            console.log('Creating new premium profile...')
            const result = await supabase
                .from('profiles')
                .insert({
                    email: email,
                    status: 'premium',
                    subscription_expires_at: expiryIso
                })
                .select()
            profileData = result.data
            profileError = result.error
            console.log('Insert result:', { data: profileData, error: profileError })
        }

        if (profileError) {
            console.error('❌ FAILED to upsert user:', email, profileError.message)
            console.error('Full error:', JSON.stringify(profileError, null, 2))
            return new Response(
                JSON.stringify({ error: 'Failed to update user status', details: profileError }),
                { 
                    status: 500,
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json'
                    }
                }
            )
        }

        console.log('✅ SUCCESS! Profile updated/created for:', email)
        console.log('Profile data:', profileData)
        console.log('Order data:', orderData)
        console.log('=== WEBHOOK COMPLETED ===\n')

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Payment processed successfully',
                email: email,
                order_id: order_id,
                transaction_status: transaction_status,
                environment: IS_PRODUCTION ? 'production' : 'sandbox'
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
        console.error('Webhook processing error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
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
