// AI Chat Proxy Handler
// This Edge Function securely proxies AI requests to protect API keys

// @ts-ignore - Deno runtime types
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// @ts-ignore - Deno runtime
const MAIA_API_KEY = Deno.env.get('MAIA_API_KEY')
const MAIA_API_URL = 'https://api.maiarouter.ai/v1/chat/completions'

// CORS Headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
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
        console.log('=== AI Chat Request ===')
        
        if (!MAIA_API_KEY) {
            console.error('MAIA_API_KEY not configured')
            return new Response(
                JSON.stringify({ error: 'AI service not configured' }),
                { 
                    status: 500,
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json'
                    }
                }
            )
        }

        const payload = await req.json()
        console.log('Request payload:', {
            model: payload.model,
            messageCount: payload.messages?.length,
            hasSystemPrompt: payload.messages?.[0]?.role === 'system'
        })

        // Forward request to Maia API
        const response = await fetch(MAIA_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MAIA_API_KEY}`
            },
            body: JSON.stringify(payload)
        })

        const data = await response.json()
        
        if (!response.ok) {
            console.error('AI API error:', data)
            return new Response(
                JSON.stringify({ 
                    error: 'AI request failed',
                    details: data
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

        console.log('AI response:', {
            model: data.model,
            usage: data.usage,
            hasContent: !!data.choices?.[0]?.message?.content
        })

        return new Response(
            JSON.stringify(data),
            { 
                status: 200,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            }
        )

    } catch (error: any) {
        console.error('AI Chat error:', error)
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
