// Midtrans Webhook Handler
// This Edge Function processes payment notifications from Midtrans

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const MIDTRANS_SERVER_KEY = Deno.env.get('MIDTRANS_SERVER_KEY')!

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

        // ✅ STEP 1: Update/Create order record (AUDIT TRAIL)
        console.log('Step 1: Updating order record...')
        
        // Check if order exists to increment webhook_attempts
        const { data: existingOrder } = await supabase
            .from('orders')
            .select('webhook_attempts')
            .eq('order_id', order_id)
            .single()

        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .upsert({
                order_id,
                email,
                transaction_status,
                fraud_status,
                payment_type,
                gross_amount: parseFloat(gross_amount),
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
        console.log('Order data:', orderData)
        console.log('=== WEBHOOK COMPLETED ===\n')

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Payment processed successfully',
                email: email,
                order_id: order_id,
                transaction_status: transaction_status
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
