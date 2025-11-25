import { analyzeArabicText as geminiAnalyze, askAiAssistant as geminiAsk, convertToArabGundul as geminiConvert } from './geminiService';
import { analyzeArabicTextOpenRouter, askAiAssistantOpenRouter, convertToArabGundulOpenRouter } from './openRouterService';
import { analyzeArabicTextMaia, askAiAssistantMaia, convertToArabGundulMaia } from './maiaService';
import { analyzeArabicTextOpenAI, askAiAssistantOpenAI, convertToArabGundulOpenAI } from './openaiService';
import type { AnalysisResult } from '../types';

export type AiProvider = 'gemini' | 'openrouter' | 'maia' | 'openai';

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
    } else if (provider === 'maia') {
        return await analyzeArabicTextMaia(text);
    } else if (provider === 'openai') {
        return await analyzeArabicTextOpenAI(text);
    }
    return await geminiAnalyze(text);
}

export async function askAiAssistant(message: string): Promise<string> {
    const provider = getActiveProvider();
    if (provider === 'openrouter') {
        return await askAiAssistantOpenRouter(message);
    } else if (provider === 'maia') {
        return await askAiAssistantMaia(message);
    } else if (provider === 'openai') {
        return await askAiAssistantOpenAI(message);
    }
    return await geminiAsk(message);
}

export async function convertToArabGundul(text: string): Promise<string> {
    const provider = getActiveProvider();
    if (provider === 'openrouter') {
        return await convertToArabGundulOpenRouter(text);
    } else if (provider === 'maia') {
        return await convertToArabGundulMaia(text);
    } else if (provider === 'openai') {
        return await convertToArabGundulOpenAI(text);
    }
    return await geminiConvert(text);
}
