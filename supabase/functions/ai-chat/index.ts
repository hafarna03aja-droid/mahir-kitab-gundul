// Setup Deno & Import Google AI SDK
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.1.3"; // Versi stabil untuk Edge

// Setup Deno & Import Google AI SDK
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.1.3"; // Versi stabil untuk Edge

// Konfigurasi CORS (Agar frontend bisa akses backend ini)
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-gemini-api-key',
};

serve(async (req: Request) => {
    // 1. Handle CORS Preflight Request (Browser checking)
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // Ambil API Key dari Header (User Provided) atau Environment Variables Supabase (System Default)
        const userApiKey = req.headers.get('x-gemini-api-key');
        const systemApiKey = Deno.env.get('GEMINI_API_KEY');

        // Prioritaskan User Key jika ada
        const apiKey = (userApiKey && userApiKey.trim() !== '') ? userApiKey : systemApiKey;

        // Cek apakah API Key ada
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY belum disetting di Supabase Secrets dan User tidak menyediakan Key.");
        }

        // 2. Parse Data dari Frontend
        const { messages, model, response_format, temperature } = await req.json();

        // Validasi input
        if (!messages || !Array.isArray(messages)) {
            throw new Error("Format 'messages' salah atau kosong.");
        }

        // 3. Pisahkan System Prompt vs User Message
        // Gemini membedakan System Instruction dengan Chat History
        let systemInstruction = "";
        const chatHistory = [];

        for (const msg of messages) {
            if (msg.role === 'system') {
                // Gabungkan jika ada multiple system prompt
                systemInstruction += msg.content + "\n";
            } else {
                // Mapping role: 'user' tetap 'user', 'assistant' jadi 'model'
                chatHistory.push({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                });
            }
        }

        // Ambil pesan terakhir user untuk di-prompt (Gemini chat session style)
        // Atau jika one-shot, kita kirim semua sebagai history kecuali yang terakhir
        const lastMessage = chatHistory.pop();
        if (!lastMessage) throw new Error("Tidak ada pesan user.");

        // 4. Inisialisasi Google AI
        const genAI = new GoogleGenerativeAI(apiKey);

        // Default ke flash jika model tidak dikirim
        const modelName = model || "gemini-1.5-flash";

        // Config Generation
        const generationConfig = {
            temperature: temperature || 0.3,
            // Jika frontend minta JSON mode
            responseMimeType: response_format?.type === 'json_object' ? "application/json" : "text/plain",
        };

        const genModel = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: systemInstruction ? systemInstruction.trim() : undefined
        });

        // 5. Mulai Chat / Generate Content
        const chat = genModel.startChat({
            history: chatHistory, // Pesan sebelumnya (konteks)
            generationConfig,
        });

        const result = await chat.sendMessage(lastMessage.parts[0].text);
        const responseText = result.response.text();

        // 6. Kirim Response balik ke Frontend
        // Kita format mirip OpenAI agar frontend tidak perlu banyak ubahan
        const responseData = {
            choices: [
                {
                    message: {
                        role: "assistant",
                        content: responseText
                    }
                }
            ],
            usage: {
                // Dummy data, Gemini API belum standar return token usage di simple response
                total_tokens: 0
            }
        };

        return new Response(JSON.stringify(responseData), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error: any) {
        console.error("Error di Edge Function:", error.message);

        // Return Error ke Frontend
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }
});
