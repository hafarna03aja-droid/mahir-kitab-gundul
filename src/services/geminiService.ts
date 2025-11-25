// File ini menggunakan Google Generative AI SDK resmi untuk stabilitas lebih baik
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
    GenerativeModel
} from "@google/generative-ai";
import type { AnalysisResult } from '../types';

const ENV_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

/**
 * Mengambil API key dari localStorage atau .env.
 */
export const getApiKey = (): string => {
    return localStorage.getItem('gemini_api_key') || ENV_API_KEY;
};

/**
 * Inisialisasi Model Gemini dengan konfigurasi "Anti Gagal".
 * Menggunakan gemini-1.5-flash yang lebih cepat dan mendukung JSON Mode native.
 */
const getGeminiModel = (jsonMode: boolean = false): GenerativeModel => {
    const API_KEY = getApiKey();

    if (!API_KEY) {
        throw new Error('API Key belum dikonfigurasi. Silakan atur API Key di pengaturan.');
    }

    const genAI = new GoogleGenerativeAI(API_KEY);

    return genAI.getGenerativeModel({
        model: "gemini-1.5-flash", // LEBIH CEPAT & STABIL DIBANDING GEMINI-PRO
        // System Instruction: Ini KUNCI agar AI paham dia adalah ahli bahasa Arab
        systemInstruction: `Anda adalah pakar bahasa Arab (Nahwu dan Shorof) yang mendalam. 
        Tugas Anda adalah menganalisis teks Arab yang diberikan pengguna dengan akurat dan detail.
        Berikan analisis yang komprehensif mencakup I'rab (kedudukan kata), Sharaf (morfologi), 
        akar kata, dan penjelasan yang mudah dipahami dalam Bahasa Indonesia.`,
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
 * Wrapper umum untuk memanggil Gemini
 */
async function callGeminiSDK(prompt: string, jsonMode: boolean = false): Promise<string> {
    try {
        const model = getGeminiModel(jsonMode);
        console.log('🔄 Mengirim request ke Gemini 1.5 Flash...');

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (!text) throw new Error("Response kosong dari Gemini.");

        console.log('✅ Berhasil!');
        return text;
    } catch (error: any) {
        console.error('❌ Error calling Gemini SDK:', error);

        // Handle error spesifik Google
        let errorMsg = error.message || "Terjadi kesalahan tidak dikenal";
        if (errorMsg.includes("API key not valid")) errorMsg = "API Key tidak valid. Cek kembali di Google AI Studio.";
        if (errorMsg.includes("429")) errorMsg = "Quota terlampaui (Rate Limit). Tunggu sebentar.";

        throw new Error(`Gagal: ${errorMsg}`);
    }
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
    // Prompt disederhanakan karena kita menggunakan JSON Mode di config model
    const prompt = `
    Analisis teks Arab berikut: "${arabicText}"
    
    Tugas:
    1. Berikan harakat lengkap (vocalizedText).
    2. Terjemahkan ke Indonesia.
    3. Pecah per kata (irab) dan analisis Nahwu (I'rab) serta Sharaf (Morfologi).
    
    Output WAJIB mengikuti struktur JSON ini:
    {
        "originalText": "string",
        "vocalizedText": "string",
        "translation": "string",
        "irab": [
            {
                "word": "string (kata gundul)",
                "vocalized_word": "string (kata berharakat)",
                "word_translation": "string",
                "analysis_details": {
                    "i_rab": "string (analisis kedudukan kata/nahwu)",
                    "i_rab_translation": "string (penjelasan irab bahasa indonesia)",
                    "sharaf": "string (wazan/bentuk kata)",
                    "sharaf_translation": "string (penjelasan sharaf bahasa indonesia)",
                    "root_word": "string (akar kata)",
                    "balaghah": "string (opsional)"
                }
            }
        ]
    }
    `;

    try {
        // Panggil dengan mode JSON = true
        const jsonString = await callGeminiSDK(prompt, true);
        const result = JSON.parse(jsonString) as AnalysisResult;

        // Validasi data minimal
        if (!result.vocalizedText) result.vocalizedText = arabicText;
        if (!result.irab) result.irab = [];

        return result;
    } catch (error) {
        console.error("Gagal parsing analisis:", error);
        throw new Error("Gagal menganalisis struktur teks Arab. Coba kalimat yang lebih pendek.");
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
