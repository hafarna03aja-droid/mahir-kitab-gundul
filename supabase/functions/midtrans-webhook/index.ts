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

        // First, try to find existing user by email
        const { data: existingUser } = await supabase
            .from('profiles')
            .select('id, email, status')
            .eq('email', email)
            .single()

        let profileData
        let profileError

        if (existingUser) {
            // Update existing user to premium
            const result = await supabase
                .from('profiles')
                .update({ status: 'premium', updated_at: new Date().toISOString() })
                .eq('email', email)
                .select()
            profileData = result.data
            profileError = result.error
        } else {
            // Create new profile for user who paid without signup
            const result = await supabase
                .from('profiles')
                .insert({
                    email: email,
                    status: 'premium',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
            profileData = result.data
            profileError = result.error
        }

        if (profileError) {
            console.error('Failed to upsert user:', email, profileError.message)
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
