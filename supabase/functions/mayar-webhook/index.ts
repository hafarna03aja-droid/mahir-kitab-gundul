// Mayar.id Webhook Handler for Premium User Activation
// This Edge Function processes payment notifications from Mayar.id
// and upgrades user status to 'premium' upon successful payment.

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from '@supabase/supabase-js'

console.log("Mayar Webhook Handler initialized")

// Define expected Mayar webhook payload structure
interface MayarWebhookPayload {
  status: string
  customer?: {
    email?: string
  }
  // Add other fields as needed based on Mayar.id documentation
}

Deno.serve(async (req) => {
  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Parse the webhook payload
    const payload: MayarWebhookPayload = await req.json()
    console.log('Received webhook payload:', JSON.stringify(payload))

    // Extract email from payload
    const email = payload.customer?.email
    if (!email) {
      console.error('Email not found in payload')
      return new Response(
        JSON.stringify({ error: 'Email not found in payload' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Verify payment status
    const status = payload.status?.toUpperCase()
    if (status !== 'PAID' && status !== 'SETTLED') {
      console.log(`Payment status is ${status}, not processing`)
      return new Response(
        JSON.stringify({ message: 'Payment not completed', status }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client with Service Role Key (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Update user profile to premium
    const { data, error } = await supabase
      .from('profiles')
      .update({ status: 'premium' })
      .eq('email', email)
      .select()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to update user status', details: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!data || data.length === 0) {
      console.warn(`No user found with email: ${email}`)
      return new Response(
        JSON.stringify({ error: 'User not found', email }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Successfully upgraded user ${email} to premium`)
    return new Response(
      JSON.stringify({
        success: true,
        message: 'User upgraded to premium',
        email,
        updated: data.length
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/mayar-webhook' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"customer": {"email": "test@example.com"}, "status": "PAID"}'

*/
