import type { AnalysisResult } from '../types';
import { AIProviderFactory, type AIProvider } from './aiProviderFactory';

// Default Env Keys (Function-level secrets are preferred, but these can be fallbacks)
const ENV_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export type { AIProvider };

export interface AIConfig {
    provider: AIProvider;
    apiKey: string;
    model?: string;
}

export const getAIConfig = (): AIConfig => {
    const provider = (localStorage.getItem('ai_provider') as AIProvider) || 'gemini';

    // Retrieve key based on provider
    let apiKey = '';
    let model = '';

    switch (provider) {
        case 'gemini':
            // Use user's API key if set, otherwise use server-side with KV cache
            apiKey = localStorage.getItem('gemini_api_key') || ENV_GEMINI_API_KEY || 'USE_SERVER';
            model = 'gemini-1.5-flash';
            break;
        case 'openai':
            apiKey = localStorage.getItem('openai_api_key') || '';
            model = 'gpt-4o-mini';
            break;
        case 'openrouter':
            apiKey = localStorage.getItem('openrouter_api_key') || '';
            model = 'meta-llama/llama-3.3-70b-instruct:free';
            break;
        case 'maia':
            apiKey = localStorage.getItem('maia_api_key') || '';
            model = 'maia/gemini-2.5-flash';
            break;
    }

    return { provider, apiKey, model };
};

// --- Public API Functions ---
// Now using AIProviderFactory for better provider management

export async function askAiAssistant(userMessage: string): Promise<string> {
    const config = getAIConfig();
    // No need to check for API key - factory handles fallback to Cloudflare/KV cache
    return await AIProviderFactory.askAssistant(config, userMessage);
}

export async function analyzeArabicText(arabicText: string): Promise<AnalysisResult> {
    const config = getAIConfig();
    // No need to check for API key - factory handles fallback to Cloudflare/KV cache
    return await AIProviderFactory.analyzeText(config, arabicText);
}

export async function convertToArabGundul(indonesianText: string): Promise<string> {
    const config = getAIConfig();
    // No need to check for API key - factory handles fallback to Cloudflare/KV cache
    return await AIProviderFactory.convertToArabGundul(config, indonesianText);
}
