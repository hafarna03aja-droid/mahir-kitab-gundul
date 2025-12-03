// Midtrans Payment - Generate Snap Token
// This Edge Function creates a Midtrans transaction and returns the Snap token

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const MIDTRANS_SERVER_KEY = Deno.env.get('MIDTRANS_SERVER_KEY') || ''
const MIDTRANS_API_URL = "https://app.sandbox.midtrans.com/snap/v1/transactions"

Deno.serve(async (req: Request) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        })
    }

    try {
        const { email, amount, item_name } = await req.json()

        if (!email || !amount) {
            return new Response(
                JSON.stringify({ error: 'Email and amount are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
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
            console.error('Midtrans API Error:', data)
            return new Response(
                JSON.stringify({ error: 'Failed to create transaction', details: data }),
                {
                    status: response.status,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
            )
        }

        return new Response(
            JSON.stringify({
                snap_token: data.token,
                order_id: orderId
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        )

    } catch (error: any) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        )
    }
})
