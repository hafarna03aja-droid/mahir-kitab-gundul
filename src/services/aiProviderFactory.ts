/**
 * AI Provider Factory
 * Handles dynamic provider switching with proper SDK initialization
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import type { AnalysisResult } from '../types';
import { supabase } from '../supabaseClient';
import { FunctionsHttpError } from '@supabase/supabase-js';

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
        const systemInstruction = "Kamu adalah asisten pakar Bahasa Arab (Nahwu, Sharaf, Balaghah). Jawab ringkas, jelas, gunakan referensi kaidah.";

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
                // Check if this is a 429 (rate limit) error FIRST
                if (error instanceof FunctionsHttpError && error.context?.status === 429) {
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
        const systemInstruction = "You are an expert Arabic grammarian. Analyze the following text and output strictly valid JSON as requested.";

        const prompt = `Analisis struktur gramatikal (I'rab) kalimat Arab berikut: "${arabicText}".
    
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
                "i_rab": "kedudukan nahwu",
                "i_rab_translation": "penjelasan irab",
                "sharaf": "bentuk morfologi",
                "sharaf_translation": "penjelasan sharaf",
                "root_word": "akar kata",
                "balaghah": "aspek balaghah (opsional)"
            }
        }
    ]
}`;

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
                // Check if this is a 429 (rate limit) error FIRST
                if (error instanceof FunctionsHttpError && error.context?.status === 429) {
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
                // Check if this is a 429 (rate limit) error FIRST
                if (error instanceof FunctionsHttpError && error.context?.status === 429) {
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
