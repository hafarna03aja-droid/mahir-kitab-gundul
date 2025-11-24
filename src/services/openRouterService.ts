import OpenAI from 'openai';
import type { AnalysisResult } from '../types';

const ENV_OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';

export const getOpenRouterApiKey = (): string => {
    return localStorage.getItem('openrouter_api_key') || ENV_OPENROUTER_API_KEY;
};

const getOpenAIClient = () => {
    const apiKey = getOpenRouterApiKey();
    if (!apiKey) {
        throw new Error('OpenRouter API Key belum dikonfigurasi. Silakan atur di pengaturan.');
    }

    return new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: apiKey,
        dangerouslyAllowBrowser: true, // Required for client-side usage
        defaultHeaders: {
            "HTTP-Referer": window.location.origin,
            "X-Title": "Mahir Arab Gundul",
        },
    });
};

const MODEL_ID = "meta-llama/llama-3.3-70b-instruct:free";

async function callOpenRouter(prompt: string, jsonMode: boolean = false): Promise<string> {
    try {
        const openai = getOpenAIClient();
        console.log(`🔄 Mengirim request ke OpenRouter (${MODEL_ID})...`);

        const completion = await openai.chat.completions.create({
            model: MODEL_ID,
            messages: [
                { role: "user", content: prompt }
            ],
            response_format: jsonMode ? { type: "json_object" } : undefined,
        });

        const text = completion.choices[0].message.content;
        if (!text) throw new Error("Response kosong dari OpenRouter.");

        console.log('✅ Berhasil dari OpenRouter!');
        return text;
    } catch (error: any) {
        console.error('❌ Error calling OpenRouter:', error);
        throw new Error(`Gagal OpenRouter: ${error.message || error}`);
    }
}

export async function askAiAssistantOpenRouter(userMessage: string): Promise<string> {
    const prompt = `Kamu adalah asisten pakar Bahasa Arab (Nahwu, Sharaf, Balaghah). Jawablah pertanyaan ini dengan ringkas, jelas, dan menggunakan referensi kaidah bahasa yang benar:\n\nPertanyaan: "${userMessage}"`;
    return await callOpenRouter(prompt, false);
}

export async function analyzeArabicTextOpenRouter(arabicText: string): Promise<AnalysisResult> {
    const prompt = `
    Analisis teks Arab berikut: "${arabicText}"
    
    Tugas:
    1. Berikan harakat lengkap (vocalizedText).
    2. Terjemahkan ke Indonesia.
    3. Pecah per kata (irab) dan analisis Nahwu (I'rab) serta Sharaf (Morfologi).
    
    Output WAJIB JSON valid dengan struktur:
    {
        "originalText": "${arabicText}",
        "vocalizedText": "string",
        "translation": "string",
        "irab": [
            {
                "word": "string",
                "vocalized_word": "string",
                "word_translation": "string",
                "analysis_details": {
                    "i_rab": "string",
                    "i_rab_translation": "string",
                    "sharaf": "string",
                    "sharaf_translation": "string",
                    "root_word": "string",
                    "balaghah": "string"
                }
            }
        ]
    }
    `;

    try {
        const jsonString = await callOpenRouter(prompt, true);
        const result = JSON.parse(jsonString) as AnalysisResult;

        if (!result.vocalizedText) result.vocalizedText = arabicText;
        if (!result.irab) result.irab = [];

        return result;
    } catch (error) {
        console.error("Gagal parsing analisis OpenRouter:", error);
        throw new Error("Gagal menganalisis struktur teks Arab via OpenRouter.");
    }
}

export async function convertToArabGundulOpenRouter(indonesianText: string): Promise<string> {
    const prompt = `Ubah kalimat Indonesia ini ke Arab Gundul (tanpa harakat) yang benar secara gramatikal: "${indonesianText}". Hanya output teks Arabnya saja.`;
    const res = await callOpenRouter(prompt, false);
    return res.trim();
}
