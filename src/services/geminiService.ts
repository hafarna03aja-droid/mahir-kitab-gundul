// Service ini sekarang menggunakan secure backend proxy
import type { AnalysisResult } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://viywfnjhpnunwhakhnrj.supabase.co';
const AI_CHAT_URL = `${SUPABASE_URL}/functions/v1/ai-chat`;

// Model prioritas: coba dari yang paling stabil/cepat ke yang paling canggih
const MODEL_PRIORITY = [
    "gemini-1.5-flash",    // Paling cepat, cocok untuk free tier
    "gemini-1.5-pro",      // Lebih canggih, butuh paid tier atau quota lebih
    "gemini-pro",          // Fallback untuk kompatibilitas
];

/**
 * Keep for backward compatibility - API keys now handled securely in backend
 */
export const getApiKey = (): string => {
    // API key is now handled securely in backend
    // This function is kept for compatibility but returns empty string
    // Frontend no longer needs to store API keys
    return '';
};

/**
 * Call AI via secure backend proxy (now handles API keys securely)
 */
async function callGeminiSDK(prompt: string, jsonMode: boolean = false): Promise<string> {
    let lastError: any = null;

    // Try each model in priority list
    for (const modelName of MODEL_PRIORITY) {
        try {
            const response = await fetch(AI_CHAT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: modelName,
                    messages: [
                        {
                            role: "system",
                            content: "Anda adalah ahli bahasa dan sastra Arab. Tugas Anda adalah menghasilkan teks bahasa Arab yang benar secara tata bahasa (Nahwu dan Sharaf), menggunakan harakat lengkap jika diminta, dan bergaya bahasa formal (Fusha)."
                        },
                        { role: "user", content: prompt }
                    ],
                    response_format: jsonMode ? { type: "json_object" } : undefined,
                    temperature: 0.3
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `HTTP ${response.status}`);
            }

            const data = await response.json();
            const text = data.choices?.[0]?.message?.content;

            if (!text) throw new Error("Response kosong dari AI service.");

            return text;

        } catch (error: any) {
            lastError = error;
            const errorMsg = error.message || "";

            // If model not found, try next model
            if (errorMsg.includes("404") || errorMsg.toLowerCase().includes("not found")) {
                continue;
            }

            // If rate limit, throw immediately
            if (errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED")) {
                throw new Error("⏱️ Rate limit terlampaui. Tunggu beberapa menit atau coba lagi nanti.");
            }
        }
    }

    // If all models failed
    throw new Error(`❌ Gagal menghubungi AI service: ${lastError?.message || 'Unknown error'}`);
}

/**
 * API untuk asisten AI (Chat Mode).
 */
export async function askAiAssistant(userMessage: string): Promise<string> {
    const prompt = `Kamu adalah asisten pakar Bahasa Arab (Nahwu, Sharaf, Balaghah). Jawablah pertanyaan ini dengan ringkas, jelas, dan menggunakan referensi kaidah bahasa yang benar:\n\nPertanyaan: "${userMessage}"`;
    return await callGeminiSDK(prompt, false);
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
        const jsonString = await callGeminiSDK(prompt, true);
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
    const res = await callGeminiSDK(prompt, false);
    return res.trim();
}
