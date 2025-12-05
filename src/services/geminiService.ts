import type { AnalysisResult } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://viywfnjhpnunwhakhnrj.supabase.co';
const AI_CHAT_URL = `${SUPABASE_URL}/functions/v1/ai-chat`;
const ENV_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// PENTING: Untuk Free Tier Google AI Studio, gunakan 1.5 Flash.
// Model Pro memiliki rate limit yang jauh lebih ketat (2 RPM vs 15 RPM di Flash).
const MODEL_PRIORITY = [
    "gemini-1.5-flash",    // Recommended: Cepat, Pintar, Free Tier Friendly (15 RPM)
];

export const getGeminiApiKey = (): string => {
    // Prioritas: User input > Environment variable
    return localStorage.getItem('gemini_api_key') || ENV_GEMINI_API_KEY;
};

/**
 * Helper untuk membersihkan output JSON dari Gemini yang sering ada markdown blocknya
 */
function cleanJsonOutput(text: string): string {
    // Hapus ```json di awal dan ``` di akhir, serta whitespace
    return text.replace(/^```json\s*/g, '').replace(/^```\s*/g, '').replace(/\s*```$/g, '').trim();
}

/**
 * Call AI via secure backend proxy
 * Note: Kita mengirim parameter 'systemInstruction' secara dinamis sekarang
 */
async function callGeminiSDK(
    prompt: string,
    systemInstruction: string,
    jsonMode: boolean = false
): Promise<string> {

    let lastError: any = null;
    const userApiKey = localStorage.getItem('gemini_api_key');

    for (const modelName of MODEL_PRIORITY) {
        try {
            // Mode 1: User input API key sendiri -> Direct call ke Google AI API
            if (userApiKey) {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${userApiKey}`;
                
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `${systemInstruction}\n\n${prompt}`
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.3,
                            ...(jsonMode ? { responseMimeType: "application/json" } : {})
                        }
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error?.message || `HTTP Error ${response.status}`);
                }

                const data = await response.json();
                let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

                if (!text) throw new Error("Empty response from Gemini API");

                if (jsonMode) {
                    text = cleanJsonOutput(text);
                }

                return text;
            }
            
            // Mode 2: Tidak ada user key -> Gunakan backend proxy (secure)
            else {
                const headers: Record<string, string> = {
                    'Content-Type': 'application/json',
                };
                
                const envKey = ENV_GEMINI_API_KEY;
                if (envKey) {
                    headers['x-gemini-api-key'] = envKey;
                }

                const response = await fetch(AI_CHAT_URL, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        model: modelName,
                        messages: [
                            { role: "system", content: systemInstruction },
                            { role: "user", content: prompt }
                        ],
                        response_format: jsonMode ? { type: "json_object" } : undefined,
                        temperature: 0.3
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || `HTTP Error ${response.status}`);
                }

                const data = await response.json();
                let text = data.choices?.[0]?.message?.content || data.output || "";

                if (!text) throw new Error("Empty response from AI");

                if (jsonMode) {
                    text = cleanJsonOutput(text);
                }

                return text;
            }

        } catch (error: any) {
            console.warn(`Model ${modelName} failed:`, error.message);
            lastError = error;

            if (error.message.includes("429")) {
                await new Promise(r => setTimeout(r, 2000));
            }
        }
    }

    throw new Error(`Gagal generate AI: ${lastError?.message || 'Unknown error'}`);
}

/**
 * API 1: Chat Assistant (Nahwu/Sharaf Advice)
 */
export async function askAiAssistant(userMessage: string): Promise<string> {
    const systemPrompt = "Kamu adalah asisten pakar Bahasa Arab (Nahwu, Sharaf, Balaghah). Jawab ringkas, jelas, gunakan referensi kaidah.";
    return await callGeminiSDK(userMessage, systemPrompt, false);
}

/**
 * Analisis teks Arab dengan JSON Mode (ANTI GAGAL PARSING).
 */
export async function analyzeArabicText(arabicText: string): Promise<AnalysisResult> {
    const prompt = `
    Analisis struktur gramatikal (I'rab) kalimat Arab berikut: "${arabicText}".
    
    Output WAJIB berupa JSON Object dengan struktur persis seperti ini:
    {
        "originalText": "${arabicText}",
        "vocalizedText": "teks arab dengan harakat lengkap",
        "translation": "terjemahan bahasa indonesia",
        "irab": [
            {
                "word": "kata asli (gundul)",
                "vocalized_word": "kata berharakat",
                "word_translation": "arti kata",
                "analysis_details": {
                    "i_rab": "kedudukan nahwu (misal: Mubtada, Khabar, Fa'il)",
                    "i_rab_translation": "penjelasan irab dalam bahasa indonesia",
                    "sharaf": "bentuk morfologi (misal: Isim Fa'il, Fi'il Madhi)",
                    "sharaf_translation": "penjelasan sharaf",
                    "root_word": "akar kata (3 huruf)",
                    "balaghah": "aspek balaghah (opsional)"
                }
            }
        ]
    }
    `;

    try {
        // Panggil dengan mode JSON = true
        const systemInstruction = "You are an expert Arabic grammarian. Analyze the following text and output strictly valid JSON as requested.";
        const jsonString = await callGeminiSDK(prompt, systemInstruction, true);
        const result = JSON.parse(jsonString) as AnalysisResult;

        // Validasi data minimal agar tidak crash
        if (!result.vocalizedText) result.vocalizedText = arabicText;
        if (!result.irab) result.irab = [];

        return result;
    } catch (error) {
        // Fallback jika gagal total
        return {
            originalText: arabicText,
            vocalizedText: arabicText,
            translation: "Gagal menganalisis teks. Silakan coba lagi.",
            irab: []
        };
    }
}

/**
 * Konversi teks Indonesia ke Arab gundul.
 */
export async function convertToArabGundul(indonesianText: string): Promise<string> {
    const prompt = `Ubah kalimat Indonesia ini ke Arab Gundul (tanpa harakat) yang benar secara gramatikal: "${indonesianText}". Hanya output teks Arabnya saja.`;
    const systemInstruction = "You are an expert Arabic translator. Convert the following text to accurate Arab Gundul (unvocalized Arabic script).";
    const res = await callGeminiSDK(prompt, systemInstruction, false);
    return res.trim();
}
