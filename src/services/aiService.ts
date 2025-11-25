import { analyzeArabicText as geminiAnalyze, askAiAssistant as geminiAsk, convertToArabGundul as geminiConvert } from './geminiService';
import { analyzeArabicTextOpenRouter, askAiAssistantOpenRouter, convertToArabGundulOpenRouter } from './openRouterService';
import type { AnalysisResult } from '../types';

export type AiProvider = 'gemini' | 'openrouter';

export const getActiveProvider = (): AiProvider => {
    return (localStorage.getItem('active_provider') as AiProvider) || 'gemini';
};

export const setActiveProvider = (provider: AiProvider) => {
    localStorage.setItem('active_provider', provider);
};

export async function analyzeArabicText(text: string): Promise<AnalysisResult> {
    const provider = getActiveProvider();
    if (provider === 'openrouter') {
        return await analyzeArabicTextOpenRouter(text);
    }
    return await geminiAnalyze(text);
}

export async function askAiAssistant(message: string): Promise<string> {
    const provider = getActiveProvider();
    if (provider === 'openrouter') {
        return await askAiAssistantOpenRouter(message);
    }
    return await geminiAsk(message);
}

export async function convertToArabGundul(text: string): Promise<string> {
    const provider = getActiveProvider();
    if (provider === 'openrouter') {
        return await convertToArabGundulOpenRouter(text);
    }
    return await geminiConvert(text);
}
