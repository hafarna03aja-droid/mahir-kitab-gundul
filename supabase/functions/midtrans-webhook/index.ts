// Midtrans Webhook Handler
// This Edge Function processes payment notifications from Midtrans

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

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
        const payload = await req.json()

        const {
            order_id,
            transaction_status,
            fraud_status,
            customer_details
        } = payload

        const email = customer_details?.email

        if (!email) {
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

        // Only process successful payments
        const isSuccess = (
            transaction_status === 'capture' ||
            transaction_status === 'settlement'
        ) && fraud_status === 'accept'

        if (!isSuccess) {
            return new Response(
                JSON.stringify({ message: 'Payment not successful yet' }),
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
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // Update user status to premium
        const { data, error } = await supabase
            .from('profiles')
            .update({ status: 'premium' })
            .eq('email', email)
            .select()

        if (error) {
            console.error('Failed to update user:', email, error.message)
            return new Response(
                JSON.stringify({ error: 'Failed to update user status', details: error }),
                { 
                    status: 500,
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json'
                    }
                }
            )
        }

        if (!data || data.length === 0) {
            console.warn(`No user found with email: ${email}`)
            return new Response(
                JSON.stringify({ warning: 'User not found, but payment recorded' }),
                { 
                    status: 200,
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json'
                    }
                }
            )
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: 'User upgraded to premium',
                email: email
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
