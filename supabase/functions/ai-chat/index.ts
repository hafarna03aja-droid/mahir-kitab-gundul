// supabase/functions/ai-chat/index.ts

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

    // Variabel Debug (Penampung Laporan)
    let debugInfo = {
        step: "Start",
        hasAuth: false,
        userId: null,
        adminKeyExists: false,
        incrementError: null,
        counterUpdated: false
    };

    try {
        const { messages, model } = await req.json();

        // 1. AUTH CHECK
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) throw new Error("Missing Auth Header");

        debugInfo.hasAuth = true;
        const token = authHeader.replace('Bearer ', '');

        // Setup Clients
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
        const anonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
        const serviceKey = Deno.env.get('SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''; // Cek kedua kemungkinan nama

        // Lapor apakah kunci admin terdeteksi
        debugInfo.adminKeyExists = !!serviceKey && serviceKey.length > 10;

        const supabase = createSupabaseClient(supabaseUrl, anonKey, token); // Client User
        const supabaseAdmin = createSupabaseClient(supabaseUrl, serviceKey); // Client Admin (Tanpa Token)

        // Cek User
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) throw new Error("Invalid Token");

        debugInfo.userId = user.id;

        // 2. RATE LIMIT CHECK
        debugInfo.step = "Checking Rate Limit";
        const rateLimit = await checkRateLimit(supabase, user.id);
        if (!rateLimit.allowed) {
            return new Response(JSON.stringify({ error: rateLimit.error }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // 3. AI PROCESSING (Maia Router)
        debugInfo.step = "Calling AI";
        const maia = new OpenAI({
            apiKey: Deno.env.get('MAIAROUTER_API_KEY'),
            baseURL: "https://api.maiarouter.ai/v1"
        });

        // Paksa ke model -001
        const completion = await maia.chat.completions.create({
            model: "maia/gemini-1.5-flash-001",
            messages: messages
        });

        const aiResponseText = completion.choices[0].message.content;

        // 4. INCREMENT COUNTER (Bagian Kritis!)
        debugInfo.step = "Incrementing Counter";
        try {
            // Kita panggil incrementUsage tapi tangkap errornya jika ada
            await incrementUsage(supabaseAdmin, user.id);
            debugInfo.counterUpdated = true;
        } catch (incError) {
            console.error("Increment Gagal:", incError);
            // Simpan pesan error untuk dikirim ke frontend
            debugInfo.incrementError = incError.message || JSON.stringify(incError);
        }

        // 5. SEND RESPONSE + DEBUG INFO
        // Kita selipkan 'debug' object ke dalam JSON response agar bisa dibaca di browser
        return new Response(JSON.stringify({
            choices: [{ message: { content: aiResponseText } }],
            debug: debugInfo // <--- INI MATATA-MATANYA
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            error: error.message,
            debug: debugInfo
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
