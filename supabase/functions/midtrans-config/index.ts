// Midtrans Config API - Returns client configuration based on environment
// This Edge Function returns the Midtrans client key and script URL

// @ts-ignore - Deno runtime types
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// Midtrans Configuration - Dynamic environment switching
// After Midtrans production approval, keys no longer have 'SB-' prefix
// But sandbox and production keys have different numbers
// @ts-ignore - Deno runtime
const IS_PRODUCTION = Deno.env.get('IS_PRODUCTION') === 'true'
// @ts-ignore - Deno runtime
const MIDTRANS_CLIENT_KEY = IS_PRODUCTION
    // @ts-ignore - Deno runtime
    ? Deno.env.get('PROD_CLIENT_KEY')
    // @ts-ignore - Deno runtime
    : Deno.env.get('SB_CLIENT_KEY')
const MIDTRANS_SCRIPT_URL = IS_PRODUCTION
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js"

console.log('🔧 Midtrans Client Config:', {
    isProduction: IS_PRODUCTION,
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
                isProduction: IS_PRODUCTION,
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
