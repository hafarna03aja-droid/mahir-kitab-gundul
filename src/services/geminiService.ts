// File ini menggunakan Google Generative AI SDK resmi untuk stabilitas lebih baik
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
    GenerativeModel
} from "@google/generative-ai";
import type { AnalysisResult } from '../types';

const ENV_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Model prioritas: coba dari yang paling stabil/cepat ke yang paling canggih
const MODEL_PRIORITY = [
    "gemini-1.5-flash",    // Paling cepat, cocok untuk free tier
    "gemini-1.5-pro",      // Lebih canggih, butuh paid tier atau quota lebih
    "gemini-pro",          // Fallback untuk kompatibilitas
];

/**
 * Validasi format API key Gemini
 */
const validateApiKey = (apiKey: string): { valid: boolean; message?: string } => {
    if (!apiKey || apiKey.trim() === '') {
        return { valid: false, message: 'API Key kosong' };
    }

    // Gemini API key biasanya dimulai dengan "AIza"
    if (!apiKey.startsWith('AIza')) {
        return {
            valid: false,
            message: 'Format API Key tidak valid. API Key Gemini biasanya dimulai dengan "AIza"'
        };
    }

    // Panjang minimal API key
    if (apiKey.length < 30) {
        return { valid: false, message: 'API Key terlalu pendek' };
    }

    return { valid: true };
};

/**
 * Mengambil API key dari localStorage atau .env.
 */
export const getApiKey = (): string => {
    return localStorage.getItem('gemini_api_key') || ENV_API_KEY;
};

/**
 * Inisialisasi Model Gemini dengan konfigurasi "Anti Gagal".
 * Support model fallback untuk kompatibilitas maksimal.
 */
const getGeminiModel = (modelName: string, jsonMode: boolean = false): GenerativeModel => {
    const API_KEY = getApiKey();

    if (!API_KEY) {
        throw new Error('API Key belum dikonfigurasi. Silakan atur API Key di pengaturan.');
    }

    // Validasi API key
    const validation = validateApiKey(API_KEY);
    if (!validation.valid) {
        throw new Error(`API Key tidak valid: ${validation.message}`);
    }

    const genAI = new GoogleGenerativeAI(API_KEY);

    return genAI.getGenerativeModel({
        model: modelName,
        // System Instruction: Ini KUNCI agar AI paham dia adalah ahli bahasa Arab
        systemInstruction: "Anda adalah ahli bahasa dan sastra Arab. Tugas Anda adalah menghasilkan teks bahasa Arab yang benar secara tata bahasa (Nahwu dan Sharaf), menggunakan harakat lengkap jika diminta, dan bergaya bahasa formal (Fusha).",
        generationConfig: {
            // Jika jsonMode true, paksa output jadi JSON valid
            responseMimeType: jsonMode ? "application/json" : "text/plain",
            temperature: 0.3, // Rendah agar analisis konsisten/tidak halu
        },
        // PENTING: Matikan safety filter agar teks Arab/Agama tidak dianggap berbahaya
        safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ]
    });
};

/**
 * Sleep utility untuk retry dengan exponential backoff
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Wrapper umum untuk memanggil Gemini dengan model fallback dan retry logic
 */
async function callGeminiSDK(prompt: string, jsonMode: boolean = false): Promise<string> {
    let lastError: any = null;

    // Coba setiap model dalam priority list
    for (let modelIndex = 0; modelIndex < MODEL_PRIORITY.length; modelIndex++) {
        const modelName = MODEL_PRIORITY[modelIndex];

        // Retry logic untuk setiap model (max 3 attempts)
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const model = getGeminiModel(modelName, jsonMode);


                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                if (!text) throw new Error("Response kosong dari Gemini.");


                return text;

            } catch (error: any) {
                lastError = error;
                const errorMsg = error.message || "";

                // Deteksi jenis error
                const isRateLimit = errorMsg.includes("429") || errorMsg.includes("RATE_LIMIT") || errorMsg.includes("RESOURCE_EXHAUSTED");
                const isNotFound = errorMsg.includes("404") || errorMsg.toLowerCase().includes("not found");
                const isInvalidKey = errorMsg.includes("API key not valid") || errorMsg.includes("PERMISSION_DENIED");
                const isServerError = errorMsg.includes("503") || errorMsg.includes("500");

                // Jika API key invalid, langsung throw tanpa retry
                if (isInvalidKey) {
                    throw new Error("❌ API Key tidak valid atau tidak memiliki akses. Periksa kembali API Key Anda di Google AI Studio (https://aistudio.google.com/app/apikey)");
                }

                // Jika model not found, coba model berikutnya
                if (isNotFound) {

                    break; // Break dari retry loop, lanjut ke model berikutnya
                }

                // Jika rate limit atau server error, retry dengan exponential backoff
                if ((isRateLimit || isServerError) && attempt < 3) {
                    const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s

                    await sleep(waitTime);
                    continue; // Retry dengan model yang sama
                }

                // Jika sudah attempt terakhir untuk model ini, coba model berikutnya
                if (attempt === 3) {

                    break;
                }
            }
        }
    }

    // Jika semua model gagal, throw error dengan pesan yang informatif
    const errorMsg = lastError?.message || "Terjadi kesalahan tidak dikenal";

    let userFriendlyMsg = "❌ Gagal menghubungi Gemini API setelah mencoba semua model.\n\n";

    if (errorMsg.includes("API key not valid") || errorMsg.includes("PERMISSION_DENIED")) {
        userFriendlyMsg += "🔑 **Masalah API Key:**\n";
        userFriendlyMsg += "- Pastikan API Key valid dan aktif\n";
        userFriendlyMsg += "- Dapatkan API Key di: https://aistudio.google.com/app/apikey\n";
        userFriendlyMsg += "- Untuk free tier, pastikan quota harian belum habis";
    } else if (errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED")) {
        userFriendlyMsg += "⏱️ **Quota/Rate Limit Terlampaui:**\n";
        userFriendlyMsg += "- Free tier: 15 requests/menit, 1500 requests/hari\n";
        userFriendlyMsg += "- Tunggu beberapa menit atau upgrade ke paid tier\n";
        userFriendlyMsg += "- Info: https://ai.google.dev/pricing";
    } else if (errorMsg.includes("404") || errorMsg.toLowerCase().includes("not found")) {
        userFriendlyMsg += "🔍 **Model Tidak Ditemukan:**\n";
        userFriendlyMsg += "- Kemungkinan API Key Anda tidak memiliki akses ke model Gemini\n";
        userFriendlyMsg += "- Coba buat API Key baru di Google AI Studio";
    } else {
        userFriendlyMsg += `📋 **Detail Error:** ${errorMsg}`;
    }

    throw new Error(userFriendlyMsg);
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
