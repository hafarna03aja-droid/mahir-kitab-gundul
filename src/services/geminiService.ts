// File ini berisi integrasi dengan Google Gemini API
// Untuk menggunakan API, Anda perlu mendapatkan API key dari Google AI Studio

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AnalysisResult } from '../types';

const ENV_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export const getApiKey = (): string => {
    return localStorage.getItem('gemini_api_key') || ENV_API_KEY;
};

async function callGeminiAPI(prompt: string): Promise<string> {
    const API_KEY = getApiKey();

    if (!API_KEY) {
        throw new Error('API Key belum dikonfigurasi. Silakan atur API Key di menu Pengaturan (ikon gerigi di pojok kanan atas) atau tambahkan VITE_GEMINI_API_KEY ke file .env Anda.');
    }

    console.log('🔄 Mengirim request ke Google Gemini API...');
    console.log(' API Key:', API_KEY.substring(0, 10) + '...');

    try {
        // Inisialisasi Google Generative AI SDK
        const genAI = new GoogleGenerativeAI(API_KEY);

        // Pilih model Gemini 1.5 Flash
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
            }
        });

        console.log('� Model: gemini-1.5-flash');
        console.log('📦 Prompt length:', prompt.length);

        // Panggil API menggunakan SDK
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('✅ Berhasil mendapat response dari Google Gemini API!');
        console.log('📝 Response length:', text.length);

        return text;
    } catch (error) {
        console.error('❌ Error calling Google Gemini API:', error);

        if (error instanceof Error) {
            // Perbaiki pesan error agar lebih informatif
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

export async function askAiAssistant(userMessage: string): Promise<string> {
    const prompt = `Kamu adalah asisten pembelajaran Bahasa Arab yang ahli dalam Nahwu (tata bahasa), Sharaf (morfologi), dan Balaghah (retorika). Jawab pertanyaan berikut dengan jelas dan informatif:\n\n${userMessage}`;

    // LANGSUNG PANGGIL API - TIDAK ADA FALLBACK DEMO
    return await callGeminiAPI(prompt);
}

// Helper function: fallback terjemahan sederhana
async function getFallbackTranslation(arabicText: string): Promise<string> {
    try {
        const simplePrompt = `Terjemahkan teks Arab berikut ke Bahasa Indonesia secara literal dan akurat:\n\n"${arabicText}"\n\nBerikan hanya terjemahan tanpa penjelasan tambahan.`;
        const translation = await callGeminiAPI(simplePrompt);
        return translation.trim();
    } catch (err) {
        console.warn('Fallback translation gagal:', err);
        return `[Terjemahan tidak tersedia untuk: ${arabicText}]`;
    }
}

export async function analyzeArabicText(arabicText: string): Promise<AnalysisResult> {
    const prompt = `Kamu adalah ahli bahasa Arab yang sangat mahir dalam analisis gramatikal (I'rab), morfologi (Sharaf), dan retorika (Balaghah).

Analisis teks Arab berikut secara mendalam:
"${arabicText}"

Berikan hasil dalam format JSON yang VALID dengan struktur berikut:
{
  "originalText": "${arabicText}",
  "vocalizedText": "teks dengan harakat lengkap",
  "translation": "terjemahan bahasa Indonesia yang akurat dan lengkap",
  "irab": [
    {
      "word": "kata dalam Arab (tanpa harakat/gundul)",
      "vocalized_word": "kata yang sama dengan harakat lengkap (fathah, kasrah, dhammah, sukun, tanwin, dsb)",
      "word_translation": "terjemahan kata ini dalam bahasa Indonesia",
      "analysis_details": {
        "i_rab": "analisis I'rab lengkap dalam istilah Arab (posisi gramatikal, tanda i'rab, fungsi dalam kalimat)",
        "i_rab_translation": "terjemahan lengkap penjelasan i_rab ke bahasa Indonesia",
        "sharaf": "analisis morfologi lengkap dalam istilah Arab (jenis kata, wazan, bentuk kata)",
        "sharaf_translation": "terjemahan lengkap penjelasan sharaf ke bahasa Indonesia",
        "root_word": "akar kata (3 huruf)",
        "balaghah": "analisis retorika jika ada (opsional)"
      }
    }
  ]
}

PENTING:
- Pastikan JSON valid dan bisa di-parse
- Berikan harakat lengkap pada vocalizedText
- WAJIB sertakan vocalized_word (kata dengan harakat lengkap) untuk setiap entry di array irab
- WAJIB sertakan terjemahan bahasa Indonesia yang jelas dan lengkap untuk seluruh kalimat
- WAJIB sertakan word_translation (terjemahan per kata) untuk setiap entry di array irab
- WAJIB sertakan i_rab_translation (terjemahan penjelasan I'rab ke Indonesia) untuk setiap kata
- WAJIB sertakan sharaf_translation (terjemahan penjelasan Sharaf ke Indonesia) untuk setiap kata
- Analisis I'rab harus detail dan akurat dalam bahasa Arab
- Analisis Sharaf harus detail dan akurat dalam bahasa Arab
- Terjemahan i_rab_translation dan sharaf_translation harus jelas dan mudah dipahami dalam bahasa Indonesia
- Harakat pada vocalized_word harus sesuai dengan posisi i'rab kata tersebut
- Jangan tambahkan penjelasan di luar JSON
- HANYA return JSON, tanpa markdown code block atau teks tambahan`;

    try {
        const responseText = await callGeminiAPI(prompt);

        // Bersihkan response dari markdown code blocks jika ada
        let cleanedResponse = responseText.trim();
        if (cleanedResponse.startsWith('```json')) {
            cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (cleanedResponse.startsWith('```')) {
            cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
        }

        // Parse JSON
        const result = JSON.parse(cleanedResponse) as AnalysisResult;

        // Validasi struktur hasil dan perbaiki jika perlu
        if (!result.originalText) {
            result.originalText = arabicText;
        }

        if (!result.vocalizedText) {
            result.vocalizedText = arabicText;
        }

        // Jika translation kosong atau tidak ada, panggil fallback
        if (!result.translation || result.translation.trim() === '') {
            console.warn('Translation kosong, menggunakan fallback...');
            result.translation = await getFallbackTranslation(arabicText);
        }

        if (!Array.isArray(result.irab)) {
            throw new Error('Format hasil analisis tidak valid: field irab harus array');
        }

        return result;
    } catch (error) {
        console.error('Error analyzing Arabic text:', error);

        // LANGSUNG THROW ERROR - TIDAK ADA FALLBACK DEMO
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Gagal menganalisis teks Arab');
    }
}

export async function convertToArabGundul(indonesianText: string): Promise<string> {
    const prompt = `Kamu adalah penerjemah Bahasa Indonesia ke Bahasa Arab yang ahli.

Konversi kalimat Bahasa Indonesia berikut ke dalam teks Arab GUNDUL (tanpa harakat):
"${indonesianText}"

PENTING:
- Hanya return teks Arab gundul, tanpa penjelasan
- Jangan tambahkan harakat
- Pastikan tata bahasa Arab yang benar
- Jangan tambahkan tanda baca selain yang diperlukan

Contoh:
Input: "ilmu itu adalah cahaya"
Output: العلم هو النور

Sekarang konversi: "${indonesianText}"`;

    try {
        const arabicText = await callGeminiAPI(prompt);
        return arabicText.trim();
    } catch (error) {
        console.error('Error converting to Arab Gundul:', error);
        throw error;
    }
}
