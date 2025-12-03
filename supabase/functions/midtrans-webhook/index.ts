// Midtrans Webhook Handler
// This Edge Function processes payment notifications from Midtrans

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req: Request) => {
    try {
        const payload = await req.json()

        console.log('Midtrans Webhook received:', payload)

        const {
            order_id,
            transaction_status,
            fraud_status,
            customer_details
        } = payload

        const email = customer_details?.email

        if (!email) {
            console.error('No email in webhook payload')
            return new Response(
                JSON.stringify({ error: 'Email is required' }),
                { status: 400 }
            )
        }

        // Only process successful payments
        const isSuccess = (
            transaction_status === 'capture' ||
            transaction_status === 'settlement'
        ) && fraud_status === 'accept'

        if (!isSuccess) {
            console.log(`Payment not successful. Status: ${transaction_status}, Fraud: ${fraud_status}`)
            return new Response(
                JSON.stringify({ message: 'Payment not successful yet' }),
                { status: 200 }
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
            console.error('Supabase update error:', error)
            return new Response(
                JSON.stringify({ error: 'Failed to update user status', details: error }),
                { status: 500 }
            )
        }

        if (!data || data.length === 0) {
            console.warn(`No user found with email: ${email}`)
            return new Response(
                JSON.stringify({ warning: 'User not found, but payment recorded' }),
                { status: 200 }
            )
        }

        console.log(`Successfully upgraded user ${email} to premium`)

        return new Response(
            JSON.stringify({
                success: true,
                message: 'User upgraded to premium',
                email: email
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )

    } catch (error: any) {
        console.error('Webhook processing error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        )
    }
})
