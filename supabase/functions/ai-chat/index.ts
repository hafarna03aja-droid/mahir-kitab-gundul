// Setup Deno & Import Google AI SDK
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.21.0";

// Konfigurasi CORS
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-gemini-api-key, x-openai-api-key, x-openrouter-api-key, x-amai-api-key, x-ai-provider, x-custom-base-url',
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
    provider?: "gemini" | "openai" | "openrouter" | "amai";
    apiBaseUrl?: string; // Optional custom base URL for 'amai' or others
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

        let apiKey = "";

        // --- PROVIDER ROUTING ---

        if (provider === "gemini") {
            const userKey = req.headers.get('x-gemini-api-key');
            apiKey = (userKey && userKey.trim() !== '') ? userKey : Deno.env.get('GEMINI_API_KEY') || "";
            if (!apiKey) throw new Error("API Key Gemini tidak ditemukan.");

            return await handleGemini(apiKey, messages, temperature, response_format);
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
                response_format
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
                }
            );
        } else if (provider === "amai") {
            const userKey = req.headers.get('x-amai-api-key');
            apiKey = (userKey && userKey.trim() !== '') ? userKey : Deno.env.get('AMAI_API_KEY') || "";

            const targetUrl = apiBaseUrl || "https://api.amai.io/v1/chat/completions";

            return await handleOpenAICompatible(
                targetUrl,
                apiKey,
                body.model || "amaigpt-default",
                messages,
                temperature,
                response_format
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

async function handleGemini(apiKey: string, messages: ChatMessage[], temperature: number, response_format: any) {
    let systemInstruction = "";
    const chatHistory = [];

    for (const msg of messages) {
        if (msg.role === 'system') {
            systemInstruction += msg.content + "\n";
        } else {
            chatHistory.push({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            });
        }
    }

    const lastMessage = chatHistory.pop();
    if (!lastMessage) throw new Error("Tidak ada pesan user.");

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = "gemini-1.5-flash"; // Force efficient model

    const generationConfig: any = { temperature: temperature };
    if (response_format?.type === 'json_object') {
        generationConfig.responseMimeType = "application/json";
    }

    const genModel = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction ? systemInstruction.trim() : undefined
    });

    const chat = genModel.startChat({
        history: chatHistory,
        generationConfig,
    });

    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const text = result.response.text();

    return successResponse(text);
}

async function handleOpenAICompatible(
    url: string,
    apiKey: string,
    model: string,
    messages: ChatMessage[],
    temperature: number,
    response_format: any,
    extraHeaders: Record<string, string> = {}
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
    const text = data.choices?.[0]?.message?.content || "";

    return successResponse(text);
}

function successResponse(text: string) {
    return new Response(JSON.stringify({
        choices: [{ message: { role: "assistant", content: text } }]
    }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
    });
}
