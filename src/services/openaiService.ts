import OpenAI from 'openai';
import type { AnalysisResult } from '../types';

const ENV_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

export const getOpenAIApiKey = (): string => {
    return localStorage.getItem('openai_api_key') || ENV_OPENAI_API_KEY;
};

const getOpenAIClient = () => {
    const apiKey = getOpenAIApiKey();
    if (!apiKey) {
        throw new Error('OpenAI API Key belum dikonfigurasi. Silakan atur di pengaturan.');
    }

    return new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true, // Required for client-side usage
    });
};

const MODEL_ID = "gpt-4o-mini";

async function callOpenAI(prompt: string, jsonMode: boolean = false): Promise<string> {
    try {
        const client = getOpenAIClient();


        const completion = await client.chat.completions.create({
            model: MODEL_ID,
            messages: [
                { role: "user", content: prompt }
            ],
            response_format: jsonMode ? { type: "json_object" } : undefined,
        });

        const text = completion.choices[0].message.content;
        if (!text) throw new Error("Response kosong dari OpenAI.");


        return text;
    } catch (error: any) {
        throw new Error(`Gagal OpenAI: ${error.message || 'Terjadi kesalahan'}`);
    }
}

export async function askAiAssistantOpenAI(userMessage: string): Promise<string> {
    const prompt = `Kamu adalah asisten pakar Bahasa Arab (Nahwu, Sharaf, Balaghah). Jawablah pertanyaan ini dengan ringkas, jelas, dan menggunakan referensi kaidah bahasa yang benar:\n\nPertanyaan: "${userMessage}"`;
    return await callOpenAI(prompt, false);
}

export async function analyzeArabicTextOpenAI(arabicText: string): Promise<AnalysisResult> {
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
        const jsonString = await callOpenAI(prompt, true);
        const result = JSON.parse(jsonString) as AnalysisResult;

        if (!result.vocalizedText) result.vocalizedText = arabicText;
        if (!result.irab) result.irab = [];

        return result;
    } catch (error) {
        console.error("Gagal parsing analisis OpenAI:", error);
        throw new Error("Gagal menganalisis struktur teks Arab via OpenAI.");
    }
}

export async function convertToArabGundulOpenAI(indonesianText: string): Promise<string> {
    const prompt = `Ubah kalimat Indonesia ini ke Arab Gundul (tanpa harakat) yang benar secara gramatikal: "${indonesianText}". Hanya output teks Arabnya saja.`;
    const res = await callOpenAI(prompt, false);
    return res.trim();
}
