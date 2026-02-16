/**
 * AI Provider Factory
 * Handles dynamic provider switching with proper SDK initialization
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import type { AnalysisResult, BeginnerAnalysisResult } from '../types';
import { supabase } from '../supabaseClient';

// Custom Error Classes for UI handling
export class DailyLimitError extends Error {
    constructor(message: string = 'Batas penggunaan harian tercapai. Coba lagi besok.') {
        super(message);
        this.name = 'DailyLimitError';
    }
}

export class MonthlyLimitError extends Error {
    constructor(message: string = 'Batas penggunaan bulanan tercapai. Silakan upgrade plan Anda.') {
        super(message);
        this.name = 'MonthlyLimitError';
    }
}

export class SubscriptionExpiredError extends Error {
    constructor(message: string = 'Masa aktif langganan Anda telah berakhir.') {
        super(message);
        this.name = 'SubscriptionExpiredError';
    }
}

export type AIProvider = 'gemini' | 'openai' | 'openrouter' | 'maia';

interface ProviderConfig {
    provider: AIProvider;
    apiKey: string;
    model?: string;
}

interface AIResponse {
    text: string;
    rawResponse?: any;
}

/**
 * Clean JSON output from markdown blocks
 */
function cleanJsonOutput(text: string): string {
    return text.replace(/^```json\s*/g, '').replace(/^```\s*/g, '').replace(/\s*```$/g, '').trim();
}

/**
 * Validate and normalize analysis result
 */
function validateAnalysisResult(data: any, originalText: string): AnalysisResult {
    return {
        originalText: data.originalText || originalText,
        vocalizedText: data.vocalizedText || originalText,
        translation: data.translation || "Terjemahan tidak tersedia.",
        irab: Array.isArray(data.irab) ? data.irab : []
    };
}

/**
 * Google Gemini Provider
 * Fix: Use correct API version and model naming
 */
class GeminiProvider {
    private client: GoogleGenerativeAI;
    private model: string;

    constructor(apiKey: string, model: string = 'gemini-1.5-flash') {
        this.client = new GoogleGenerativeAI(apiKey);
        this.model = model;
    }

    async generate(prompt: string, systemInstruction?: string, jsonMode: boolean = false): Promise<AIResponse> {
        try {
            // Use the correct model reference (no 'models/' prefix needed)
            const generativeModel = this.client.getGenerativeModel({
                model: this.model,
                systemInstruction: systemInstruction,
                generationConfig: jsonMode ? {
                    responseMimeType: "application/json",
                    temperature: 0.3,
                } : {
                    temperature: 0.3,
                }
            });

            const result = await generativeModel.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            if (!text) {
                throw new Error('Empty response from Gemini');
            }

            return {
                text: jsonMode ? cleanJsonOutput(text) : text,
                rawResponse: response
            };
        } catch (error: any) {
            console.error('Gemini Provider Error:', error);
            throw new Error(`Gemini Error: ${error.message}`);
        }
    }
}

/**
 * Cloudflare Worker Provider (uses /api/chat with KV caching)
 * Used when no user API key is provided - leverages server-side caching
 */
class CloudflareProvider {
    async generate(prompt: string, systemInstruction?: string, jsonMode: boolean = false): Promise<AIResponse> {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    systemInstruction: systemInstruction,
                    jsonMode: jsonMode
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || error.message || 'API request failed');
            }

            const data = await response.json();

            // Log cache status for debugging
            if (data.source === 'cache_kv') {
                console.log('⚡ Response from KV cache (fast!)');
            } else {
                console.log('🤖 Response from Gemini API via Cloudflare');
            }

            return {
                text: jsonMode ? cleanJsonOutput(data.text) : data.text,
                rawResponse: data
            };
        } catch (error: any) {
            console.error('Cloudflare Provider Error:', error);
            throw new Error(`Cloudflare API Error: ${error.message}`);
        }
    }
}

/**
 * OpenAI-Compatible Provider (OpenAI, Maia, OpenRouter)
 */

class OpenAICompatibleProvider {
    private client: OpenAI;
    private model: string;
    private provider: AIProvider;

    constructor(config: {
        apiKey: string;
        model: string;
        provider: AIProvider;
        baseURL?: string;
        extraHeaders?: Record<string, string>;
    }) {
        this.provider = config.provider;
        this.model = config.model;

        const clientConfig: any = {
            apiKey: config.apiKey,
            dangerouslyAllowBrowser: true, // Required for client-side usage
        };

        // Set custom base URL for non-OpenAI providers
        if (config.baseURL) {
            clientConfig.baseURL = config.baseURL;
        }

        // Add extra headers (for OpenRouter)
        if (config.extraHeaders) {
            clientConfig.defaultHeaders = config.extraHeaders;
        }

        this.client = new OpenAI(clientConfig);
    }

    async generate(prompt: string, systemInstruction?: string, jsonMode: boolean = false): Promise<AIResponse> {
        try {
            const messages: any[] = [];

            if (systemInstruction) {
                messages.push({ role: 'system', content: systemInstruction });
            }

            messages.push({ role: 'user', content: prompt });

            const completion = await this.client.chat.completions.create({
                model: this.model,
                messages: messages,
                temperature: 0.3,
                response_format: jsonMode ? { type: 'json_object' } : undefined,
            });

            const text = completion.choices[0]?.message?.content || '';

            if (!text) {
                throw new Error(`Empty response from ${this.provider}`);
            }

            return {
                text: jsonMode ? cleanJsonOutput(text) : text,
                rawResponse: completion
            };
        } catch (error: any) {
            console.error(`${this.provider} Provider Error:`, error);
            throw new Error(`${this.provider} Error: ${error.message}`);
        }
    }
}

/**
 * Provider Factory - Main Entry Point
 */
export class AIProviderFactory {
    static createProvider(config: ProviderConfig) {
        const { provider, apiKey, model } = config;

        // Special case: Use CloudflareProvider with KV caching when no user API key
        // This enables server-side caching and keeps API key secure
        if (!apiKey || apiKey.trim() === '' || apiKey === 'USE_SERVER') {
            if (provider === 'gemini') {
                console.log('🌐 Using Cloudflare Provider with KV caching');
                return new CloudflareProvider();
            }
            throw new Error(`API Key required for ${provider}. Please configure in settings.`);
        }

        switch (provider) {
            case 'gemini':
                console.log('🔑 Using direct Gemini API with user key');
                return new GeminiProvider(apiKey, model || 'gemini-1.5-flash');


            case 'openai':
                return new OpenAICompatibleProvider({
                    apiKey,
                    model: model || 'gpt-4o-mini',
                    provider: 'openai',
                });

            case 'maia':
                return new OpenAICompatibleProvider({
                    apiKey,
                    model: model || 'maia/gemini-2.5-flash',
                    provider: 'maia',
                    baseURL: 'https://api.maiarouter.ai/v1',
                });

            case 'openrouter':
                return new OpenAICompatibleProvider({
                    apiKey,
                    model: model || 'meta-llama/llama-3.3-70b-instruct:free',
                    provider: 'openrouter',
                    baseURL: 'https://openrouter.ai/api/v1',
                    extraHeaders: {
                        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://mahirarab.web.id',
                        'X-Title': 'Mahir Arab Gundul',
                    },
                });

            default:
                throw new Error(`Unsupported provider: ${provider}`);
        }
    }

    /**
     * Helper to handle common Supabase Function errors (including monthly limit)
     */
    private static handleSupabaseError(error: any): never {
        const errorMsg = error.message || '';
        const dataError = error.context?.json?.error || '';

        // 1. Subscription Expired (check FIRST before daily/monthly)
        if (dataError === 'SUBSCRIPTION_EXPIRED' ||
            errorMsg.includes('SUBSCRIPTION_EXPIRED') ||
            errorMsg.includes('expired') ||
            errorMsg.includes('subscription ended') ||
            errorMsg.includes('berakhir') ||
            errorMsg.includes('Langganan')) {
            throw new SubscriptionExpiredError();
        }

        // 2. Monthly Limit
        if (errorMsg.includes('Batas penggunaan bulanan') || dataError.includes('Batas penggunaan bulanan')) {
            throw new MonthlyLimitError();
        }

        // 3. Daily Limit
        if (error.status === 429 ||
            errorMsg.includes('Batas harian') ||
            errorMsg.includes('Batas penggunaan harian') ||
            errorMsg.includes('rate limit') ||
            errorMsg.includes('limit') ||
            errorMsg.includes('Kuota') ||
            dataError.includes('Batas harian') ||
            dataError.includes('rate limit')) {
            throw new DailyLimitError();
        }

        // 4. Auth Issues
        if (errorMsg.includes('Invalid Token') || errorMsg.includes('Unauthorized') || errorMsg.includes('Missing Auth')) {
            throw new Error('Anda belum login. Silakan login terlebih dahulu untuk menggunakan fitur ini.');
        }

        throw error;
    }

    /**
     * High-level API: Ask AI Assistant
     * Uses Supabase Edge Function for rate limiting and usage tracking
     */
    static async askAssistant(_config: ProviderConfig, userMessage: string): Promise<string> {
        const systemInstruction = `Anda adalah Pakar Bahasa Arab dan Studi Islam dari Mahir Arab AI. Tugas Anda adalah menjadi asisten virtual bagi muslim di Indonesia.

Ruang Lingkup Jawaban Anda:

1. **Al-Quran & Hadits**: Jika ditanya tentang ayat atau hadits, berikan teks Arabnya, terjemahan bahasa Indonesia yang akurat, dan penjelasan singkat (tadabbur) yang mudah dipahami.

2. **Bahasa Arab Harian**: Bantu pengguna menerjemahkan kalimat sehari-hari atau belajar percakapan Arab praktis.

3. **Analisis Mendalam**: Tetap sediakan penjelasan Nahwu, Sharaf, dan Balaghah jika pengguna memintanya secara spesifik.

Gaya Bahasa:
- Gunakan nada bicara yang ramah, memotivasi, dan suportif.
- Gunakan format Markdown (teks tebal, list, atau tabel) agar jawaban mudah dibaca di layar HP.
- Hindari istilah teknis yang terlalu berat kecuali jika ditanya oleh pengguna tingkat lanjut.
- Jawab dalam Bahasa Indonesia, sisipkan istilah Arab jika relevan.`;

        try {
            const { data, error } = await supabase.functions.invoke('ai-chat', {
                body: {
                    messages: [
                        { role: "system", content: systemInstruction },
                        { role: "user", content: userMessage }
                    ]
                }
            });

            if (error) {
                // Check status code for specific errors
                const status = error.context?.status || error.status;
                const errorMsg = error.message || '';

                // Check for subscription expiration (403)
                if (status === 403 || errorMsg.includes("SUBSCRIPTION_EXPIRED")) {
                    throw new SubscriptionExpiredError();
                }

                // Check for rate limit (429)
                if (status === 429 || errorMsg.includes("DAILY_LIMIT")) {
                    throw new DailyLimitError();
                }

                console.error('Supabase Edge Function Error:', error);
                // throw new Error(error.message || 'Edge Function call failed');
                throw error;
            }

            // Check if Edge Function returned an error in the response body
            if (data?.error) {
                console.error('Edge Function Response Error:', data.error, data.debug);
                throw new Error(data.error);
            }

            const responseText = data?.choices?.[0]?.message?.content || '';

            if (!responseText) {
                throw new Error('Empty response from AI');
            }

            return responseText;
        } catch (error: any) {
            console.error('Ask Assistant Failed:', error);
            try {
                this.handleSupabaseError(error);
            } catch (handledError) {
                throw handledError;
            }
            throw new Error('Gagal mendapatkan jawaban. Periksa koneksi atau coba lagi.');
        }
    }

    /**
     * High-level API: Analyze Arabic Text
     * Uses Supabase Edge Function for rate limiting and usage tracking
     */
    static async analyzeText(_config: ProviderConfig, arabicText: string): Promise<AnalysisResult> {
        const systemInstruction = "Anda adalah Ustadz dan pakar tata bahasa Arab (Nahwu & Sharaf) dengan metode Pesantren (Kitab Kuning). Tugas Anda adalah menganalisis teks Arab dan memberikan output dalam format JSON yang valid. Gunakan Bahasa Indonesia untuk semua penjelasan.";

        const prompt = `Analisis kalimat: "${arabicText}".
    
Output WAJIB JSON Object:
{
    "originalText": "${arabicText}",
    "vocalizedText": "teks berharakat lengkap",
    "translation": "terjemahan lengkap yang mengalir (Bahasa Indonesia)",
    "irab": [
        {
            "word": "kata",
            "vocalized_word": "kata berharakat",
            "word_translation": "arti kata dalam Bahasa Indonesia",
            "analysis_details": {
                "i_rab": "WAJIB ditulis dalam AKSARA ARAB. Jelaskan kedudukan (مبتدأ/خبر/فاعل/مفعول به/dll), Hukum (مرفوع/منصوب/مجرور/مجزوم), Tanda (الضمة/الفتحة/الكسرة/السكون), dan Alasannya. Contoh: اسم مجرور بالباء وعلامة جره الكسرة الظاهرة على آخره",
                "i_rab_translation": "Penjelasan i'rab dalam Bahasa Indonesia yang mudah dipahami",
                "sharaf": "WAJIB ditulis dalam AKSARA ARAB. Jelaskan jenis kata, wazan, bina, dan sighat. Contoh: اسم جامد (غير مشتق)",
                "sharaf_translation": "Penjelasan sharaf dalam Bahasa Indonesia yang mudah dipahami",
                "root_word": "akar kata dalam huruf Arab",
                "balaghah": "aspek balaghah jika ada, ditulis dalam AKSARA ARAB dengan penjelasan"
            }
        }
    ]
}

PENTING:
1. Field i_rab dan sharaf WAJIB ditulis dalam AKSARA ARAB (bukan huruf latin/romanisasi). Contoh yang BENAR: "اسم مجرور بالباء وعلامة جره الكسرة". Contoh yang SALAH: "Ismu Majrur bil Ba'".
2. Field i_rab_translation dan sharaf_translation ditulis dalam Bahasa Indonesia sebagai penjelasan.
3. Irab harus detail ala pesantren (Kedudukan, Hukum, Tanda, Alasan).
4. Sharaf harus menyebutkan Wazan dan Sighat dalam aksara Arab.
5. Field word_translation dan translation dalam Bahasa Indonesia.`;

        try {
            // Call Supabase Edge Function for rate limiting and usage tracking
            const { data, error } = await supabase.functions.invoke('ai-chat', {
                body: {
                    messages: [
                        { role: "system", content: systemInstruction },
                        { role: "user", content: prompt }
                    ]
                }
            });

            if (error) {
                // Check status code for specific errors
                const status = error.context?.status || error.status;
                const errorMsg = error.message || '';

                // Check for subscription expiration (403)
                if (status === 403 || errorMsg.includes("SUBSCRIPTION_EXPIRED")) {
                    throw new SubscriptionExpiredError();
                }

                // Check for rate limit (429)
                if (status === 429 || errorMsg.includes("DAILY_LIMIT")) {
                    throw new DailyLimitError();
                }

                console.error('Supabase Edge Function Error:', error);
                // throw new Error(error.message || 'Edge Function call failed');
                throw error;
            }

            // Check if Edge Function returned an error in the response body
            if (data?.error) {
                console.error('Edge Function Response Error:', data.error, data.debug);
                throw new Error(data.error);
            }

            // Extract text from OpenAI-compatible response format
            const responseText = data?.choices?.[0]?.message?.content || '';

            if (!responseText) {
                throw new Error('Empty response from AI');
            }

            // Clean and parse JSON response
            const cleanedText = cleanJsonOutput(responseText);
            const rawResult = JSON.parse(cleanedText);
            return validateAnalysisResult(rawResult, arabicText);
        } catch (error: any) {
            console.error('Analysis Failed:', error);
            try {
                this.handleSupabaseError(error); // This will throw handling known errors
            } catch (handledError) {
                throw handledError;
            }
            throw new Error('Gagal menganalisis teks. Periksa koneksi atau coba lagi.');
        }
    }

    /**
     * High-level API: Analyze Arabic Text for Beginners (Arti Per-kata)
     * Returns simplified word-by-word meanings
     */
    static async analyzeTextBeginner(_config: ProviderConfig, arabicText: string): Promise<BeginnerAnalysisResult> {
        const systemInstruction = "Anda adalah guru Bahasa Arab untuk pemula. Tugas Anda adalah memecah kalimat Arab menjadi kata-kata tunggal dan memberikan arti per-kata yang akurat dalam Bahasa Indonesia. Output dalam format JSON yang valid.";

        const prompt = `Pecah kalimat Arab berikut menjadi kata per kata dan berikan artinya dalam Bahasa Indonesia: "${arabicText}".

Output WAJIB JSON Object:
{
    "originalText": "${arabicText}",
    "translation": "terjemahan lengkap kalimat dalam Bahasa Indonesia",
    "words": [
        { "word": "kata arab tanpa harakat", "vocalized_word": "kata arab berharakat lengkap", "meaning": "arti dalam bahasa indonesia" },
        { "word": "kata arab tanpa harakat", "vocalized_word": "kata arab berharakat lengkap", "meaning": "arti dalam bahasa indonesia" }
    ]
}

PENTING:
1. Pecah setiap kata secara individual, termasuk partikel (huruf jar, huruf athaf, dll).
2. vocalized_word WAJIB diisi dengan kata Arab yang sudah diberi harakat lengkap (fathah, dhammah, kasrah, sukun, tanwin, tasydid).
3. Arti harus sederhana, mudah dipahami oleh pemula.
4. Gunakan Bahasa Indonesia sepenuhnya untuk arti.
5. Urutan kata harus sesuai urutan asli dalam kalimat Arab (kanan ke kiri).
6. Terjemahan keseluruhan harus mengalir dan natural.`;

        try {
            const { data, error } = await supabase.functions.invoke('ai-chat', {
                body: {
                    messages: [
                        { role: "system", content: systemInstruction },
                        { role: "user", content: prompt }
                    ]
                }
            });

            if (error) {
                const status = error.context?.status || error.status;
                const errorMsg = error.message || '';

                if (status === 403 || errorMsg.includes("SUBSCRIPTION_EXPIRED")) {
                    throw new SubscriptionExpiredError();
                }

                if (status === 429 || errorMsg.includes("DAILY_LIMIT")) {
                    throw new DailyLimitError();
                }

                console.error('Supabase Edge Function Error:', error);
                throw error;
            }

            if (data?.error) {
                console.error('Edge Function Response Error:', data.error, data.debug);
                throw new Error(data.error);
            }

            const responseText = data?.choices?.[0]?.message?.content || '';

            if (!responseText) {
                throw new Error('Empty response from AI');
            }

            const cleanedText = cleanJsonOutput(responseText);
            const rawResult = JSON.parse(cleanedText);

            return {
                originalText: rawResult.originalText || arabicText,
                translation: rawResult.translation || 'Terjemahan tidak tersedia.',
                words: Array.isArray(rawResult.words) ? rawResult.words.map((w: any) => ({
                    word: w.word || '',
                    vocalized_word: w.vocalized_word || w.word || '',
                    meaning: w.meaning || ''
                })) : []
            };
        } catch (error: any) {
            console.error('Beginner Analysis Failed:', error);
            try {
                this.handleSupabaseError(error);
            } catch (handledError) {
                throw handledError;
            }
            throw new Error('Gagal menganalisis teks. Periksa koneksi atau coba lagi.');
        }
    }

    /**
     * High-level API: Convert to Arab Gundul
     * Uses Supabase Edge Function for rate limiting and usage tracking
     */
    static async convertToArabGundul(_config: ProviderConfig, indonesianText: string): Promise<string> {
        const systemInstruction = "You are an expert Arabic translator. Convert the following text to accurate Arab Gundul (unvocalized Arabic script).";
        const prompt = `Ubah kalimat Indonesia ini ke Arab Gundul (tanpa harakat) yang benar secara gramatikal: "${indonesianText}". Hanya output teks Arabnya saja.`;

        try {
            const { data, error } = await supabase.functions.invoke('ai-chat', {
                body: {
                    messages: [
                        { role: "system", content: systemInstruction },
                        { role: "user", content: prompt }
                    ]
                }
            });

            if (error) {
                // Check status code for specific errors
                const status = error.context?.status || error.status;
                const errorMsg = error.message || '';

                // Check for subscription expiration (403)
                if (status === 403 || errorMsg.includes("SUBSCRIPTION_EXPIRED")) {
                    throw new SubscriptionExpiredError();
                }

                // Check for rate limit (429)
                if (status === 429 || errorMsg.includes("DAILY_LIMIT")) {
                    throw new DailyLimitError();
                }

                console.error('Supabase Edge Function Error:', error);
                // throw new Error(error.message || 'Edge Function call failed');
                throw error;
            }

            // Check if Edge Function returned an error in the response body
            if (data?.error) {
                console.error('Edge Function Response Error:', data.error, data.debug);
                throw new Error(data.error);
            }

            const responseText = data?.choices?.[0]?.message?.content || '';

            if (!responseText) {
                throw new Error('Empty response from AI');
            }

            return responseText.trim();
        } catch (error: any) {
            console.error('Convert to Arab Gundul Failed:', error);
            try {
                this.handleSupabaseError(error);
            } catch (handledError) {
                throw handledError;
            }
            throw new Error('Gagal mengkonversi teks. Periksa koneksi atau coba lagi.');
        }
    }
}
