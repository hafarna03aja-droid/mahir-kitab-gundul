import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.28.0";
import { checkRateLimit, incrementUsage, createSupabaseClient } from '../_shared/rateLimiter.ts';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

    // --- VARIABEL DEBUG (PENAMPUNG LAPORAN) ---
    let debugInfo: any = {
        step: "Start",
        hasAuth: false,
        userId: null,
        adminKeyExists: false,
        incrementError: null,
        counterUpdated: false,
        aiError: null
    };

    try {
        const { messages } = await req.json();

        // 1. AUTH CHECK
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({
                error: "Missing Auth Header - Silakan login terlebih dahulu",
                debug: debugInfo
            }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        debugInfo.hasAuth = true;
        const token = authHeader.replace('Bearer ', '');

        // SETUP CLIENTS
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
        const anonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
        // Cek Service Key (Admin)
        const serviceKey = Deno.env.get('SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

        // Lapor status kunci admin
        debugInfo.adminKeyExists = !!serviceKey && serviceKey.length > 10;

        const supabase = createSupabaseClient(supabaseUrl, anonKey, token); // Client User (untuk cek profil)
        const supabaseAdmin = createSupabaseClient(supabaseUrl, serviceKey); // Client Admin (KHUSUS UPDATE COUNTER)

        // Cek User
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) {
            return new Response(JSON.stringify({
                error: "Invalid Token - Silakan login ulang",
                debug: { ...debugInfo, authError: authError?.message }
            }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        debugInfo.userId = user.id;

        // 2. RATE LIMIT CHECK
        debugInfo.step = "Checking Rate Limit";
        const rateLimit = await checkRateLimit(supabaseAdmin, user.id);
        if (!rateLimit.allowed) {
            return new Response(JSON.stringify({ error: rateLimit.error }), {
                status: rateLimit.status || 429, // Use dynamic status code (403 for expired, 429 for limits)
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // 3. AI PROCESSING (Maia Router)
        debugInfo.step = "Calling AI";

        const maiaApiKey = Deno.env.get('MAIAROUTER_API_KEY');
        if (!maiaApiKey) {
            return new Response(JSON.stringify({
                error: "Server configuration error: Missing AI API key",
                debug: debugInfo
            }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        let aiResponseText: string;
        try {
            const maia = new OpenAI({
                apiKey: maiaApiKey,
                baseURL: "https://api.maiarouter.ai/v1"
            });

            const completion = await maia.chat.completions.create({
                model: "maia/gemini-2.5-flash",
                messages: messages
            });

            aiResponseText = completion.choices[0]?.message?.content || '';

            if (!aiResponseText) {
                throw new Error("Empty response from AI");
            }
        } catch (aiError: any) {
            console.error("AI API Error:", aiError);
            debugInfo.aiError = aiError.message || String(aiError);
            return new Response(JSON.stringify({
                error: "Gagal menghubungi layanan AI. Coba lagi nanti.",
                debug: debugInfo
            }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // 4. INCREMENT COUNTER (CRITICAL STEP)
        debugInfo.step = "Incrementing Counter";
        try {
            // PENTING: Pakai supabaseAdmin (bukan supabase biasa)
            await incrementUsage(supabaseAdmin, user.id);
            debugInfo.counterUpdated = true;
        } catch (incError: any) {
            console.error("Increment Gagal:", incError);
            debugInfo.incrementError = incError.message || JSON.stringify(incError);
        }

        // 5. SEND RESPONSE + DEBUG INFO
        // Kita bungkus responsenya agar Debug Info terbawa
        return new Response(JSON.stringify({
            choices: [{ message: { content: aiResponseText } }],
            debug: debugInfo // <--- INI MATA-MATANYA
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error("Unhandled Error:", error);
        return new Response(JSON.stringify({
            error: error.message || "An unexpected error occurred",
            debug: debugInfo
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
