/**
 * Cloudflare Pages Function: AI Chat with KV Cache
 * Path: /api/chat
 * 
 * Features:
 * - KV caching for AI responses (30 days TTL)
 * - Dynamic API key switching (user key vs app key)
 * - Google Gemini 1.5 Flash integration
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Environment interface for Cloudflare Pages
interface Env {
    AI_CACHE: KVNamespace;
    GOOGLE_API_KEY: string;
}

// Request body interface
interface ChatRequest {
    prompt: string;
    userApiKey?: string;
}

// Response interface
interface ChatResponse {
    text: string;
    source: 'cache_kv' | 'api_user' | 'api_app';
}

/**
 * POST /api/chat
 * Handles AI chat requests with caching and dynamic API key selection
 */
export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        // Parse request body
        const body = await context.request.json() as ChatRequest;
        const { prompt, userApiKey } = body;

        // Validation: Check if prompt exists
        if (!prompt || prompt.trim() === '') {
            return new Response(
                JSON.stringify({ 
                    error: 'Prompt is required',
                    message: 'Please provide a valid prompt'
                }), 
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Priority 1: Check KV Cache
        const cachedResponse = await context.env.AI_CACHE.get(prompt);
        if (cachedResponse) {
            console.log('✅ Cache HIT:', prompt.substring(0, 50));
            return new Response(
                JSON.stringify({
                    text: cachedResponse,
                    source: 'cache_kv'
                } as ChatResponse),
                {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        console.log('❌ Cache MISS, calling AI...', prompt.substring(0, 50));

        // Priority 2: Determine API Key (Dynamic Switch)
        let activeApiKey: string;
        let source: 'api_user' | 'api_app';

        // KONDISI 1: User provides their own API key
        if (userApiKey && userApiKey.trim().length > 0) {
            activeApiKey = userApiKey.trim();
            source = 'api_user';
            console.log('🔑 Using USER API Key');
        } 
        // KONDISI 2: Use server's API key (fallback)
        else {
            if (!context.env.GOOGLE_API_KEY) {
                return new Response(
                    JSON.stringify({
                        error: 'API Key not configured',
                        message: 'Please provide your own API key or contact administrator'
                    }),
                    {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }
            activeApiKey = context.env.GOOGLE_API_KEY;
            source = 'api_app';
            console.log('🔑 Using APP API Key (fallback)');
        }

        // Execute AI Generation
        const genAI = new GoogleGenerativeAI(activeApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        if (!text || text.trim() === '') {
            throw new Error('Empty response from AI');
        }

        // Save to KV Cache (TTL: 30 days)
        const TTL_30_DAYS = 60 * 60 * 24 * 30; // seconds
        await context.env.AI_CACHE.put(prompt, text, {
            expirationTtl: TTL_30_DAYS
        });
        console.log('💾 Saved to cache');

        // Return successful response
        return new Response(
            JSON.stringify({
                text: text,
                source: source
            } as ChatResponse),
            {
                status: 200,
                headers: { 
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=3600' // Browser cache 1 hour
                }
            }
        );

    } catch (error: any) {
        console.error('❌ AI Chat Error:', error);

        // Handle specific errors
        let errorMessage = 'Failed to generate AI response';
        let statusCode = 500;

        if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('invalid')) {
            errorMessage = 'Invalid API key provided';
            statusCode = 401;
        } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
            errorMessage = 'API quota exceeded. Please try again later or use your own API key';
            statusCode = 429;
        } else if (error.message?.includes('network') || error.message?.includes('timeout')) {
            errorMessage = 'Network error. Please try again';
            statusCode = 503;
        }

        return new Response(
            JSON.stringify({
                error: errorMessage,
                details: error.message || 'Unknown error',
                timestamp: new Date().toISOString()
            }),
            {
                status: statusCode,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};
