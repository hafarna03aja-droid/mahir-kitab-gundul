// Setup Deno & Import OpenAI SDK for Maia Router
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.28.0";
import { checkRateLimit, incrementUsage, createSupabaseClient } from '../_shared/rateLimiter.ts';

// Konfigurasi CORS
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-gemini-api-key, x-openai-api-key, x-openrouter-api-key, x-maia-api-key, x-ai-provider, x-custom-base-url',
};

interface ChatMessage {
    role: string;
    content: string;
}

interface RequestBody {
    messages: ChatMessage[];
    model?: string;
    temperature?: number;
    response_format?: { type: "json_object" };
    provider?: "gemini" | "openai" | "openrouter" | "maia";
    apiBaseUrl?: string; // Optional custom base URL for 'maia' or others
}

serve(async (req: Request) => {
    // 1. Handle CORS Preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // Parse Body
        const body: RequestBody = await req.json();
        const { messages, temperature = 0.3, response_format, provider = "gemini", apiBaseUrl } = body;

        // --- AUTH & RATE LIMITING ---
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const token = authHeader.replace('Bearer ', '');
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
        const serviceRoleKey = Deno.env.get('SERVICE_ROLE_KEY') || '';

        // Client User: untuk auth.getUser() dan checkRateLimit() - mengikuti RLS
        const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, token);

        // Client Admin: untuk incrementUsage() - bypass RLS dengan SERVICE_ROLE_KEY
        const supabaseAdmin = createSupabaseClient(supabaseUrl, serviceRoleKey);

        // Verify token and get user
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized: Invalid Token' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Check rate limit
        const rateLimitResult = await checkRateLimit(supabase, user.id);
        if (!rateLimitResult.allowed) {
            return new Response(JSON.stringify({
                error: rateLimitResult.error,
                code: 'RATE_LIMIT_EXCEEDED',
                remaining: 0
            }), {
                status: 429,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
        // -----------------------------

        let apiKey = "";

        // --- PROVIDER ROUTING ---

        if (provider === "gemini") {
            // Using Maia Router with OpenAI SDK format
            apiKey = Deno.env.get('MAIAROUTER_API_KEY') || "";
            if (!apiKey) throw new Error("API Key Maia Router tidak ditemukan.");

            return await handleMaiaRouter(apiKey, messages, temperature, response_format, supabaseAdmin, user.id);
        } else if (provider === "openai") {
            const userKey = req.headers.get('x-openai-api-key');
            apiKey = (userKey && userKey.trim() !== '') ? userKey : Deno.env.get('OPENAI_API_KEY') || "";
            if (!apiKey) throw new Error("API Key OpenAI tidak ditemukan.");

            return await handleOpenAICompatible(
                "https://api.openai.com/v1/chat/completions",
                apiKey,
                body.model || "gpt-3.5-turbo",
                messages,
                temperature,
                response_format,
                {},
                supabaseAdmin,
                user.id
            );
        } else if (provider === "openrouter") {
            const userKey = req.headers.get('x-openrouter-api-key');
            apiKey = (userKey && userKey.trim() !== '') ? userKey : Deno.env.get('OPENROUTER_API_KEY') || "";
            if (!apiKey) throw new Error("API Key OpenRouter tidak ditemukan.");

            return await handleOpenAICompatible(
                "https://openrouter.ai/api/v1/chat/completions",
                apiKey,
                body.model || "google/gemini-2.0-flash-exp:free",
                messages,
                temperature,
                response_format,
                {
                    "HTTP-Referer": "https://mahirarab.web.id",
                    "X-Title": "Mahir Arab AI"
                },
                supabaseAdmin,
                user.id
            );
        } else if (provider === "maia") {
            const userKey = req.headers.get('x-maia-api-key');
            apiKey = (userKey && userKey.trim() !== '') ? userKey : Deno.env.get('MAIA_API_KEY') || "";

            const targetUrl = apiBaseUrl || "https://api.maiarouter.ai/v1/chat/completions";

            return await handleOpenAICompatible(
                targetUrl,
                apiKey,
                body.model || "maia/gemini-1.5-flash-001",
                messages,
                temperature,
                response_format,
                {},
                supabaseAdmin,
                user.id
            );
        } else {
            throw new Error(`Provider '${provider}' tidak dikenal.`);
        }

    } catch (error: any) {
        console.error("Error di Edge Function:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }
});

// --- HANDLERS ---

/**
 * Handler untuk Maia Router menggunakan OpenAI SDK
 * Menggantikan implementasi Google Generative AI sebelumnya
 */
async function handleMaiaRouter(
    apiKey: string,
    messages: ChatMessage[],
    temperature: number,
    response_format: any,
    supabase: any,
    userId: string
) {
    // Inisialisasi OpenAI client dengan konfigurasi Maia Router
    const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://api.maiarouter.ai/v1",
    });

    // Konversi messages ke format OpenAI
    // System instruction dipindahkan ke role: "system"
    const openaiMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [];

    for (const msg of messages) {
        if (msg.role === 'system') {
            openaiMessages.push({
                role: "system",
                content: msg.content
            });
        } else if (msg.role === 'assistant') {
            openaiMessages.push({
                role: "assistant",
                content: msg.content
            });
        } else {
            // Default to user
            openaiMessages.push({
                role: "user",
                content: msg.content
            });
        }
    }

    // Buat request ke Maia Router
    const completionParams: any = {
        model: "maia/gemini-1.5-flash-001",
        messages: openaiMessages,
        temperature: temperature,
    };

    // Tambahkan response_format jika diperlukan
    if (response_format?.type === 'json_object') {
        completionParams.response_format = { type: "json_object" };
    }

    const response = await openai.chat.completions.create(completionParams);

    // Parse response dengan format OpenAI
    let text = response.choices[0]?.message?.content || "";

    // Bersihkan markdown code block jika ada (```json ... ```)
    text = cleanJsonResponse(text);

    // Increment usage count
    await incrementUsage(supabase, userId);

    return successResponse(text);
}

async function handleOpenAICompatible(
    url: string,
    apiKey: string,
    model: string,
    messages: ChatMessage[],
    temperature: number,
    response_format: any,
    extraHeaders: Record<string, string> = {},
    supabase: any,
    userId: string
) {
    const payload: any = {
        model: model,
        messages: messages,
        temperature: temperature
    };

    if (response_format?.type === 'json_object') {
        payload.response_format = { type: "json_object" };
    }

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            ...extraHeaders
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Provider Error (${response.status}): ${err}`);
    }

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content || "";

    // Bersihkan markdown code block jika ada
    text = cleanJsonResponse(text);

    await incrementUsage(supabase, userId);
    return successResponse(text);
}

/**
 * Membersihkan response dari markdown code block (```json ... ```)
 */
function cleanJsonResponse(text: string): string {
    if (!text) return text;

    // Remove ```json at the start and ``` at the end
    let cleaned = text.trim();

    // Pattern untuk menghapus markdown code block
    if (cleaned.startsWith('```json')) {
        cleaned = cleaned.slice(7); // Remove ```json
    } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.slice(3); // Remove ```
    }

    if (cleaned.endsWith('```')) {
        cleaned = cleaned.slice(0, -3); // Remove trailing ```
    }

    return cleaned.trim();
}

function successResponse(text: string) {
    return new Response(JSON.stringify({
        choices: [{ message: { role: "assistant", content: text } }]
    }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
    });
}
