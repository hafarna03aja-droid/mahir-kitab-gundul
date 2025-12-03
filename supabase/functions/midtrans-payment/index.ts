// Midtrans Payment - Generate Snap Token
// This Edge Function creates a Midtrans transaction and returns the Snap token

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// SANDBOX Configuration
const MIDTRANS_SERVER_KEY = Deno.env.get('MIDTRANS_SERVER_KEY')
const MIDTRANS_API_URL = "https://app.sandbox.midtrans.com/snap/v1/transactions"

if (!MIDTRANS_SERVER_KEY) {
    throw new Error('MIDTRANS_SERVER_KEY environment variable is required')
}

// CORS Headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

Deno.serve(async (req: Request) => {
    // Handle CORS Preflight Request
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            status: 200,
            headers: corsHeaders
        })
    }

    try {
        const { email, amount, item_name } = await req.json()

        console.log('Request received:', { email, amount, item_name })
        console.log('Server Key available:', !!MIDTRANS_SERVER_KEY)

        // Validate email and amount
        if (!email || !amount) {
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
        if (!email.includes('@') || email.length < 5) {
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

        // Generate unique order ID
        const orderId = `MAHIR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        // Prepare Midtrans transaction data
        const transactionData = {
            transaction_details: {
                order_id: orderId,
                gross_amount: amount
            },
            customer_details: {
                email: email,
                first_name: email.split('@')[0] || 'User'
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

        // Call Midtrans API
        const authHeader = 'Basic ' + btoa(MIDTRANS_SERVER_KEY + ':')
        console.log('Auth header created, Server Key prefix:', MIDTRANS_SERVER_KEY.substring(0, 10))

        const response = await fetch(MIDTRANS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify(transactionData)
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('Midtrans API Error:', {
                status: response.status,
                statusText: response.statusText,
                data: data
            })
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

        return new Response(
            JSON.stringify({
                snap_token: data.token,
                order_id: orderId,
                redirect_url: data.redirect_url
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
