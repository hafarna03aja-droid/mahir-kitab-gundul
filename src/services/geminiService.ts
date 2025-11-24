// File ini berisi integrasi dengan Google Gemini API
// Untuk menggunakan API, Anda perlu mendapatkan API key dari Google AI Studio

import type { AnalysisResult } from '../types';

const ENV_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

/**
 * Mengambil API key dari localStorage atau .env.
 */
export const getApiKey = (): string => {
    return localStorage.getItem('gemini_api_key') || ENV_API_KEY;
};

/**
 * Memanggil Google Gemini menggunakan endpoint REST.
 * @param prompt Prompt yang akan dikirim ke model.
 * @returns Teks respons dari Gemini.
 */
async function callGeminiAPI(prompt: string): Promise<string> {
    const API_KEY = getApiKey();

    if (!API_KEY) {
        throw new Error('API Key belum dikonfigurasi. Silakan atur API Key di menu Pengaturan (ikon gerigi di pojok kanan atas) atau tambahkan VITE_GEMINI_API_KEY ke file .env Anda.');
    }

    console.log('🔄 Mengirim request ke Google Gemini API (v1beta) dengan model gemini-pro...');
    console.log('🔑 API Key:', API_KEY.substring(0, 10) + '...');

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            throw new Error('Response format unexpected or empty');
        }

        console.log('✅ Berhasil mendapat response dari Google Gemini API!');
        console.log('📝 Response length:', text.length);
        return text;
    } catch (error) {
        console.error('❌ Error calling Google Gemini API:', error);
        if (error instanceof Error) {
            let errorMessage = `Gagal menghubungi Google Gemini API\n\n`;
            errorMessage += `Error: ${error.message}\n\n`;
            errorMessage += `Periksa:\n`;
            errorMessage += `• API key valid (${API_KEY.substring(0, 10)}...)\n`;
            errorMessage += `• Quota API masih tersedia\n`;
            errorMessage += `• API key sudah diaktifkan untuk Generative Language API\n`;
            errorMessage += `• Dapatkan API key di https://aistudio.google.com/app/apikey`;
            throw new Error(errorMessage);
        }
        throw new Error('Terjadi kesalahan yang tidak diketahui saat memanggil API');
    }
}

/**
 * API untuk asisten AI.
 */
export async function askAiAssistant(userMessage: string): Promise<string> {
    const prompt = `Kamu adalah asisten pembelajaran Bahasa Arab yang ahli dalam Nahwu (tata bahasa), Sharaf (morfologi), dan Balaghah (retorika). Jawab pertanyaan berikut dengan jelas dan informatif:\n\n${userMessage}`;
    return await callGeminiAPI(prompt);
}

/**
 * Fallback sederhana untuk terjemahan.
 */
async function getFallbackTranslation(arabicText: string): Promise<string> {
    try {
        const simplePrompt = `Terjemahkan teks Arab berikut ke Bahasa Indonesia secara literal dan akurat:\n\n\"${arabicText}\"\n\nBerikan hanya terjemahan tanpa penjelasan tambahan.`;
        const translation = await callGeminiAPI(simplePrompt);
        return translation.trim();
    } catch (err) {
        console.warn('Fallback translation gagal:', err);
        return `[Terjemahan tidak tersedia untuk: ${arabicText}]`;
    }
}

/**
 * Analisis teks Arab dengan output JSON terstruktur.
 */
export async function analyzeArabicText(arabicText: string): Promise<AnalysisResult> {
    const prompt = `Kamu adalah ahli bahasa Arab yang sangat mahir dalam analisis gramatikal (I'rab), morfologi (Sharaf), dan retorika (Balaghah).\n\nAnalisis teks Arab berikut secara mendalam:\n\"${arabicText}\"\n\nBerikan hasil dalam format JSON yang VALID dengan struktur berikut:\n{\n  \"originalText\": \"${arabicText}\",\n  \"vocalizedText\": \"teks dengan harakat lengkap\",\n  \"translation\": \"terjemahan bahasa Indonesia yang akurat dan lengkap\",\n  \"irab\": [\n    {\n      \"word\": \"kata dalam Arab (tanpa harakat/gundul)\",\n      \"vocalized_word\": \"kata yang sama dengan harakat lengkap\",\n      \"word_translation\": \"terjemahan kata ini dalam bahasa Indonesia\",\n      \"analysis_details\": {\n        \"i_rab\": \"analisis I'rab lengkap dalam istilah Arab\",\n        \"i_rab_translation\": \"terjemahan penjelasan i_rab ke bahasa Indonesia\",\n        \"sharaf\": \"analisis morfologi lengkap dalam istilah Arab\",\n        \"sharaf_translation\": \"terjemahan penjelasan sharaf ke bahasa Indonesia\",\n        \"root_word\": \"akar kata (3 huruf)\",\n        \"balaghah\": \"analisis retorika jika ada (opsional)\"\n      }\n    }\n  ]\n}\n\nPENTING:\n- Pastikan JSON valid dan dapat diparse\n- Sertakan harakat lengkap pada vocalizedText\n- Sertakan vocalized_word untuk setiap entry di irab\n- Sertakan terjemahan bahasa Indonesia yang jelas untuk seluruh kalimat\n- Sertakan word_translation, i_rab_translation, dan sharaf_translation\n- Analisis I'rab dan Sharaf harus detail dan akurat dalam bahasa Arab\n- Jangan menambahkan penjelasan di luar JSON\n- HANYA return JSON, tanpa markdown code block atau teks tambahan`;

    const responseText = await callGeminiAPI(prompt);
    let cleaned = responseText.trim();
    if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/```\n?/g, '');
    }
    const result = JSON.parse(cleaned) as AnalysisResult;

    if (!result.originalText) result.originalText = arabicText;
    if (!result.vocalizedText) result.vocalizedText = arabicText;
    if (!result.translation || result.translation.trim() === '') {
        console.warn('Translation kosong, menggunakan fallback...');
        result.translation = await getFallbackTranslation(arabicText);
    }
    if (!Array.isArray(result.irab)) {
        throw new Error('Format hasil analisis tidak valid: field irab harus array');
    }
    return result;
}

/**
 * Konversi teks Indonesia ke Arab gundul (tanpa harakat).
 */
export async function convertToArabGundul(indonesianText: string): Promise<string> {
    const prompt = `Kamu adalah penerjemah Bahasa Indonesia ke Bahasa Arab yang ahli.\n\nKonversi kalimat Bahasa Indonesia berikut ke dalam teks Arab GUNDUL (tanpa harakat):\n\"${indonesianText}\"\n\nPENTING:\n- Hanya return teks Arab gundul, tanpa penjelasan\n- Jangan menambahkan harakat\n- Pastikan tata bahasa Arab yang benar\n- Jangan menambahkan tanda baca selain yang diperlukan\n\nContoh:\nInput: \"ilmu itu adalah cahaya\"\nOutput: العلم هو النور\n\nSekarang konversi: \"${indonesianText}\"`;
    const arabicText = await callGeminiAPI(prompt);
    return arabicText.trim();
}
