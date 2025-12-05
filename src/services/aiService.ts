import type { AnalysisResult } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://viywfnjhpnunwhakhnrj.supabase.co';
const AI_CHAT_URL = `${SUPABASE_URL}/functions/v1/ai-chat`;

// Default Env Keys (Function-level secrets are preferred, but these can be fallbacks)
const ENV_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export type AIProvider = 'gemini' | 'openai' | 'openrouter' | 'amai';

export interface AIConfig {
    provider: AIProvider;
    apiKey: string;
    model?: string;
    baseUrl?: string; // For Amai or others
}

export const getAIConfig = (): AIConfig => {
    const provider = (localStorage.getItem('ai_provider') as AIProvider) || 'gemini';

    // Retrieve key based on provider
    let apiKey = '';
    let baseUrl = '';
    let model = '';

    switch (provider) {
        case 'gemini':
            apiKey = localStorage.getItem('gemini_api_key') || ENV_GEMINI_API_KEY;
            break;
        case 'openai':
            apiKey = localStorage.getItem('openai_api_key') || '';
            model = 'gpt-3.5-turbo';
            break;
        case 'openrouter':
            apiKey = localStorage.getItem('openrouter_api_key') || '';
            model = 'google/gemini-2.0-flash-exp:free';
            break;
        case 'amai':
            apiKey = localStorage.getItem('amai_api_key') || '';
            baseUrl = localStorage.getItem('amai_base_url') || 'https://api.amai.io/v1/chat/completions';
            model = 'amaigpt-default';
            break;
    }

    return { provider, apiKey, model, baseUrl };
};

/**
 * Helper to clean Markdown JSON
 */
function cleanJsonOutput(text: string): string {
    return text.replace(/^```json\s*/g, '').replace(/^```\s*/g, '').replace(/\s*```$/g, '').trim();
}

/**
 * Validates result structure slightly to ensure no crash
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
 * Call AI via Secure Backend Proxy
 */
async function callAIService(
    prompt: string,
    systemInstruction: string,
    jsonMode: boolean = false
): Promise<string> {
    const config = getAIConfig();

    // Header setup for specific keys
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (config.apiKey) {
        headers[`x-${config.provider}-api-key`] = config.apiKey;
    }

    // Payload construction
    const payload = {
        messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt }
        ],
        model: config.model,
        provider: config.provider,
        apiBaseUrl: config.baseUrl, // Optional
        response_format: jsonMode ? { type: "json_object" } : undefined,
        temperature: 0.3
    };

    try {
        const response = await fetch(AI_CHAT_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP Error ${response.status}`);
        }

        const data = await response.json();
        let text = data.choices?.[0]?.message?.content || "";

        if (!text) throw new Error("Empty response from AI Provider");

        if (jsonMode) {
            text = cleanJsonOutput(text);
        }

        return text;

    } catch (error: any) {
        console.error("AI Service Error:", error);
        throw error;
    }
}

// --- Public API Functions ---

export async function askAiAssistant(userMessage: string): Promise<string> {
    const systemPrompt = "Kamu adalah asisten pakar Bahasa Arab (Nahwu, Sharaf, Balaghah). Jawab ringkas, jelas, gunakan referensi kaidah.";
    return await callAIService(userMessage, systemPrompt, false);
}

export async function analyzeArabicText(arabicText: string): Promise<AnalysisResult> {
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
        const systemInstruction = "You are an expert Arabic grammarian. Analyze the following text and output strictly valid JSON as requested.";
        const jsonString = await callAIService(prompt, systemInstruction, true);
        const rawResult = JSON.parse(jsonString);
        return validateAnalysisResult(rawResult, arabicText);
    } catch (error) {
        console.error("Analysis Failed:", error);
        // Robustness: Return minimal mock to avoid crash
        return {
            originalText: arabicText,
            vocalizedText: arabicText,
            translation: "Gagal menganalisis teks. Periksa koneksi atau API Key.",
            irab: []
        };
    }
}

export async function convertToArabGundul(indonesianText: string): Promise<string> {
    const prompt = `Ubah kalimat Indonesia ini ke Arab Gundul (tanpa harakat) yang benar secara gramatikal: "${indonesianText}". Hanya output teks Arabnya saja.`;
    const systemInstruction = "You are an expert Arabic translator. Convert the following text to accurate Arab Gundul (unvocalized Arabic script).";
    const res = await callAIService(prompt, systemInstruction, false);
    return res.trim();
}
