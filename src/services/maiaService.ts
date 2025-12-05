import type { AnalysisResult } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://viywfnjhpnunwhakhnrj.supabase.co';
const AI_CHAT_URL = `${SUPABASE_URL}/functions/v1/ai-chat`;
const ENV_MAIA_API_KEY = import.meta.env.VITE_MAIA_API_KEY || '';

const MODEL_ID = "maia/gemini-2.5-flash";

export const getMaiaApiKey = (): string => {
    // Prioritas: User input > Environment variable
    return localStorage.getItem('maia_api_key') || ENV_MAIA_API_KEY;
};

async function callMaiaRouter(prompt: string, jsonMode: boolean = false): Promise<string> {
    try {
        const userApiKey = localStorage.getItem('maia_api_key');
        
        // Mode 1: User input API key sendiri -> Direct call ke Maia Router API
        if (userApiKey) {
            const response = await fetch('https://api.maia.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userApiKey}`
                },
                body: JSON.stringify({
                    model: MODEL_ID,
                    messages: [
                        { role: "user", content: prompt }
                    ],
                    response_format: jsonMode ? { type: "json_object" } : undefined,
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Maia API request failed');
            }

            const data = await response.json();
            const text = data.choices?.[0]?.message?.content;
            
            if (!text) throw new Error("Response kosong dari Maia API.");

            return text;
        }
        
        // Mode 2: Tidak ada user key -> Gunakan backend proxy (secure)
        else {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            
            // Gunakan env key jika ada
            if (ENV_MAIA_API_KEY) {
                headers['Authorization'] = `Bearer ${ENV_MAIA_API_KEY}`;
            }

            const response = await fetch(AI_CHAT_URL, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    model: MODEL_ID,
                    messages: [
                        { role: "user", content: prompt }
                    ],
                    response_format: jsonMode ? { type: "json_object" } : undefined,
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'AI request failed');
            }

            const data = await response.json();
            const text = data.choices?.[0]?.message?.content;
            
            if (!text) throw new Error("Response kosong dari AI service.");

            return text;
        }
    } catch (error: any) {
        throw new Error(`Gagal AI Service: ${error.message || 'Terjadi kesalahan'}`);
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
