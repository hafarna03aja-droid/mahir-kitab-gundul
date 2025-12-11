// Midtrans Config API - Returns client configuration based on environment
// This Edge Function returns the Midtrans client key and script URL

// @ts-ignore - Deno runtime types
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// Midtrans Configuration - PRODUCTION ONLY
// Sandbox mode has been removed, always use production
// @ts-ignore - Deno runtime
const MIDTRANS_CLIENT_KEY = Deno.env.get('PROD_CLIENT_KEY')
const MIDTRANS_SCRIPT_URL = "https://app.midtrans.com/snap/snap.js"

console.log('🔧 Midtrans Client Config:', {
    isProduction: true,
    scriptUrl: MIDTRANS_SCRIPT_URL,
    hasClientKey: !!MIDTRANS_CLIENT_KEY
})

// CORS Headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
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
        // Return client configuration
        return new Response(
            JSON.stringify({
                isProduction: true,
                clientKey: MIDTRANS_CLIENT_KEY,
                scriptUrl: MIDTRANS_SCRIPT_URL
            }),
            {
                status: 200,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
                }
            }
        )

    } catch (error: any) {
        console.error('Config API error:', error.message)
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
