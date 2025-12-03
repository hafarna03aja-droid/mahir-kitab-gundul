// Midtrans Payment - Generate Snap Token
// This Edge Function creates a Midtrans transaction and returns the Snap token

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// SANDBOX Configuration
const MIDTRANS_SERVER_KEY = Deno.env.get('MIDTRANS_SERVER_KEY') || 'SB-Mid-server-fi_B0_URjnBG6KUealyg1VO1'
const MIDTRANS_API_URL = "https://app.sandbox.midtrans.com/snap/v1/transactions"

// CORS Headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

console.log('🔧 Midtrans Config:')
console.log('📍 API URL:', MIDTRANS_API_URL)
console.log('🔑 Server Key:', MIDTRANS_SERVER_KEY ? '✅ Set (length: ' + MIDTRANS_SERVER_KEY.length + ')' : '❌ Missing')

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
        
        console.log('📨 Incoming request:')
        console.log('   Email:', email)
        console.log('   Amount:', amount)
        console.log('   Item:', item_name)

        if (!email || !amount) {
            console.error('❌ Validation failed: Missing email or amount')
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
                first_name: email.split('@')[0]
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
        
        console.log('🔐 Authorization:')
        console.log('   Server Key:', MIDTRANS_SERVER_KEY.substring(0, 20) + '...')
        console.log('   Auth Header:', authHeader.substring(0, 30) + '...')
        console.log('📡 Calling Midtrans API:', MIDTRANS_API_URL)
        console.log('📦 Transaction Data:', JSON.stringify(transactionData, null, 2))

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
        console.log('📨 Midtrans Response Status:', response.status)
        console.log('📦 Midtrans Response Data:', JSON.stringify(data, null, 2))

        if (!response.ok) {
            console.error('❌ Midtrans API Error:')
            console.error('   Status:', response.status)
            console.error('   Response:', JSON.stringify(data, null, 2))
            return new Response(
                JSON.stringify({ 
                    error: 'Failed to create transaction', 
                    details: data,
                    status: response.status,
                    message: data.error_messages || data.message || 'Unknown error'
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

        console.log('✅ Success! Snap Token:', data.token)
        console.log('🆔 Order ID:', orderId)
        
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
        console.error('❌ Exception caught:')
        console.error('   Message:', error.message)
        console.error('   Stack:', error.stack)
        return new Response(
            JSON.stringify({ 
                error: error.message,
                type: 'exception',
                stack: error.stack
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
