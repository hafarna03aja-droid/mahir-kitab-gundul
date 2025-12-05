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
        console.log('\n=== WEBHOOK RECEIVED ===')
        console.log('Timestamp:', new Date().toISOString())
        
        const payload = await req.json()
        console.log('Payload received:', JSON.stringify(payload, null, 2))

        const {
            order_id,
            transaction_status,
            fraud_status,
            customer_details
        } = payload

        const email = customer_details?.email
        console.log('Extracted email:', email)
        console.log('Transaction status:', transaction_status)
        console.log('Fraud status:', fraud_status)

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

        // First, try to find existing user by email
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

        if (existingUser) {
            // Update existing user to premium
            console.log('Updating existing profile to premium...')
            const result = await supabase
                .from('profiles')
                .update({ status: 'premium' })
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
                    status: 'premium'
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
        console.log('=== WEBHOOK COMPLETED ===\n')

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
