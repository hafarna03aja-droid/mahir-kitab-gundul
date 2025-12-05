import type { AnalysisResult } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://viywfnjhpnunwhakhnrj.supabase.co';
const AI_CHAT_URL = `${SUPABASE_URL}/functions/v1/ai-chat`;

const MODEL_ID = "maia/gemini-2.5-flash";

// Keep for backward compatibility - now just returns true if backend is available
export const getMaiaApiKey = (): string => {
    // API key is now handled securely in backend
    // This function is kept for compatibility but returns empty string
    // Frontend no longer needs to store API keys
    return '';
};

async function callMaiaRouter(prompt: string, jsonMode: boolean = false): Promise<string> {
    try {
        const response = await fetch(AI_CHAT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            throw new Error(error.error || 'AI request failed');
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        
        if (!text) throw new Error("Response kosong dari AI service.");

        return text;
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
