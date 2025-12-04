import OpenAI from 'openai';
import type { AnalysisResult } from '../types';

const ENV_MAIA_API_KEY = import.meta.env.VITE_MAIA_API_KEY || '';

export const getMaiaApiKey = (): string => {
    const storedKey = localStorage.getItem('maia_api_key');
    
    // Auto-initialize from environment variable if not set
    if (!storedKey && ENV_MAIA_API_KEY) {
        localStorage.setItem('maia_api_key', ENV_MAIA_API_KEY);
        return ENV_MAIA_API_KEY;
    }
    
    return storedKey || ENV_MAIA_API_KEY;
};

const getMaiaClient = () => {
    const apiKey = getMaiaApiKey();
    if (!apiKey) {
        throw new Error('⚠️ API Key belum tersedia. Silakan klik ikon ⚙️ (Pengaturan) di pojok kanan atas untuk mengatur API Key.');
    }

    return new OpenAI({
        baseURL: "https://api.maiarouter.ai/v1",
        apiKey: apiKey,
        dangerouslyAllowBrowser: true, // Required for client-side usage
        defaultHeaders: {
            "HTTP-Referer": window.location.origin,
            "X-Title": "Mahir Arab Gundul",
        },
    });
};

const MODEL_ID = "maia/gemini-2.5-flash";

async function callMaiaRouter(prompt: string, jsonMode: boolean = false): Promise<string> {
    try {
        const client = getMaiaClient();


        const completion = await client.chat.completions.create({
            model: MODEL_ID,
            messages: [
                { role: "user", content: prompt }
            ],
            response_format: jsonMode ? { type: "json_object" } : undefined,
        });

        const text = completion.choices[0].message.content;
        if (!text) throw new Error("Response kosong dari Maia Router.");


        return text;
    } catch (error: any) {
        throw new Error(`Gagal Maia Router: ${error.message || 'Terjadi kesalahan'}`);
    }
}

export async function askAiAssistantMaia(userMessage: string): Promise<string> {
    const prompt = `Kamu adalah asisten pakar Bahasa Arab (Nahwu, Sharaf, Balaghah). Jawablah pertanyaan ini dengan ringkas, jelas, dan menggunakan referensi kaidah bahasa yang benar:\n\nPertanyaan: "${userMessage}"`;
    return await callMaiaRouter(prompt, false);
}

export async function analyzeArabicTextMaia(arabicText: string): Promise<AnalysisResult> {
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
        const jsonString = await callMaiaRouter(prompt, true);
        const result = JSON.parse(jsonString) as AnalysisResult;

        if (!result.vocalizedText) result.vocalizedText = arabicText;
        if (!result.irab) result.irab = [];

        return result;
    } catch (error) {
        throw new Error("Gagal menganalisis struktur teks Arab via Maia Router.");
    }
}

export async function convertToArabGundulMaia(indonesianText: string): Promise<string> {
    const prompt = `Ubah kalimat Indonesia ini ke Arab Gundul (tanpa harakat) yang benar secara gramatikal: "${indonesianText}". Hanya output teks Arabnya saja.`;
    const res = await callMaiaRouter(prompt, false);
    return res.trim();
}
