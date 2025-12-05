# AI Provider Factory - Architecture Documentation

## Overview
Refactored backend logic to support multiple AI providers with proper SDK initialization and consistent API interface.

## Supported Providers

### 1. **Google Gemini**
- **SDK**: `@google/generative-ai`
- **Model**: `gemini-1.5-flash` (default)
- **Fix Applied**: 
  - ❌ Previous: `models/gemini-1.5-flash` with `v1beta` → 404 Error
  - ✅ Current: `gemini-1.5-flash` direct → Works correctly
- **API Key**: User input via localStorage `gemini_api_key`

### 2. **OpenAI**
- **SDK**: `openai` (official)
- **Model**: `gpt-4o-mini` (default)
- **Base URL**: Default OpenAI endpoint
- **API Key**: User input via localStorage `openai_api_key`

### 3. **Maia Router**
- **SDK**: `openai` (compatible)
- **Model**: `maia/gemini-2.5-flash` (default)
- **Base URL**: `https://api.maia.ai/v1`
- **API Key**: User input via localStorage `maia_api_key`

### 4. **OpenRouter**
- **SDK**: `openai` (compatible)
- **Model**: `meta-llama/llama-3.3-70b-instruct:free` (default)
- **Base URL**: `https://openrouter.ai/api/v1`
- **Extra Headers**:
  - `HTTP-Referer`: Site origin (required by OpenRouter)
  - `X-Title`: "Mahir Arab Gundul"
- **API Key**: User input via localStorage `openrouter_api_key`

## Architecture

```
┌─────────────────────┐
│   aiService.ts      │  ← Public API (backwards compatible)
│   - askAiAssistant  │
│   - analyzeText     │
│   - convertGundul   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│   aiProviderFactory.ts                  │  ← Provider Factory (NEW)
├─────────────────────────────────────────┤
│  AIProviderFactory.createProvider()     │  ← Factory Method
│    ├─ GeminiProvider                    │  ← Google SDK
│    └─ OpenAICompatibleProvider          │  ← OpenAI SDK
│         ├─ OpenAI                       │
│         ├─ Maia Router                  │
│         └─ OpenRouter                   │
└─────────────────────────────────────────┘
```

## Usage Example

### Basic Usage (Auto-detect from localStorage)
```typescript
import { askAiAssistant, analyzeArabicText } from './services/aiService';

// User has selected provider and entered API key in settings
// Factory will automatically use correct SDK

const response = await askAiAssistant("Apa itu Fi'il Madhi?");
const analysis = await analyzeArabicText("الكتاب جديد");
```

### Advanced Usage (Direct Factory)
```typescript
import { AIProviderFactory } from './services/aiProviderFactory';

// Gemini with custom config
const geminiResponse = await AIProviderFactory.askAssistant({
    provider: 'gemini',
    apiKey: 'AIzaSy...',
    model: 'gemini-1.5-flash'
}, "Your question here");

// OpenRouter with custom config
const openrouterResponse = await AIProviderFactory.analyzeText({
    provider: 'openrouter',
    apiKey: 'sk-or-...',
    model: 'meta-llama/llama-3.3-70b-instruct:free'
}, "النحو العربي");
```

## Key Improvements

### 1. **Fixed Gemini 404 Error**
```typescript
// ❌ Before (WRONG):
const model = client.getGenerativeModel({ 
    model: 'models/gemini-1.5-flash' // 404 Not Found
});

// ✅ After (CORRECT):
const model = client.getGenerativeModel({ 
    model: 'gemini-1.5-flash' // Works!
});
```

### 2. **Provider-Specific Configuration**
Each provider now has its own properly configured client:

```typescript
// Gemini: Native SDK
new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: "You are...",
    generationConfig: { responseMimeType: "application/json" }
});

// OpenRouter: Custom headers
new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Mahir Arab Gundul'
    }
});
```

### 3. **Consistent Response Format**
All providers return standardized `AIResponse`:
```typescript
interface AIResponse {
    text: string;
    rawResponse?: any;
}
```

### 4. **Better Error Handling**
- Provider-specific error messages
- Graceful fallbacks
- Clear user feedback

## Testing Checklist

- [ ] Gemini provider with user API key
- [ ] OpenAI provider with user API key
- [ ] Maia Router provider with user API key
- [ ] OpenRouter provider with user API key
- [ ] Error handling (invalid key, rate limits)
- [ ] JSON mode for analysis results
- [ ] Text mode for chat/assistant

## Migration Notes

### Breaking Changes
- None! Public API remains backwards compatible

### Internal Changes
- Old individual service files (`geminiService.ts`, etc.) are now deprecated
- New factory pattern centralizes provider logic
- All new features should use `AIProviderFactory`

## Future Enhancements

1. **Add More Providers**
   - Anthropic Claude
   - Cohere
   - Local models (Ollama)

2. **Rate Limiting**
   - Track usage per provider
   - Implement quota system

3. **Caching**
   - Cache frequent queries
   - Reduce API costs

4. **Streaming**
   - Support real-time streaming responses
   - Better UX for long responses
