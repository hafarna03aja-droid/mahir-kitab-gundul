import React, { useState, useEffect } from 'react';
import { X, Save, Key, Trash2, Eye, EyeOff, Bot, Cpu } from 'lucide-react';
import { getActiveProvider, setActiveProvider, type AiProvider } from '../services/aiService';

interface ApiKeySettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({ isOpen, onClose }) => {
    const [apiKey, setApiKey] = useState('');
    const [openRouterKey, setOpenRouterKey] = useState('');
    const [provider, setProvider] = useState<AiProvider>('gemini');
    const [showKey, setShowKey] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const savedKey = localStorage.getItem('gemini_api_key');
            const savedOpenRouterKey = localStorage.getItem('openrouter_api_key');
            const savedProvider = getActiveProvider();

            setApiKey(savedKey || '');
            setOpenRouterKey(savedOpenRouterKey || '');
            setProvider(savedProvider);

            setIsSaved(!!savedKey || !!savedOpenRouterKey);
        }
    }, [isOpen]);

    const handleSave = () => {
        if (apiKey.trim()) localStorage.setItem('gemini_api_key', apiKey.trim());
        if (openRouterKey.trim()) localStorage.setItem('openrouter_api_key', openRouterKey.trim());

        setActiveProvider(provider);
        setIsSaved(true);
        onClose();
        alert('Pengaturan berhasil disimpan!');
        window.location.reload();
    };

    const handleClear = () => {
        localStorage.removeItem('gemini_api_key');
        localStorage.removeItem('openrouter_api_key');
        setApiKey('');
        setOpenRouterKey('');
        setIsSaved(false);
        alert('Semua API Key berhasil dihapus.');
        window.location.reload();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center py-6 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200 max-h-[75vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800 shrink-0 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                            <Key className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pengaturan AI Provider</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5 overflow-y-auto">
                    {/* Provider Selection - Prominent */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wide">
                            🤖 Pilih AI Provider
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setProvider('gemini')}
                                className={`relative p-4 rounded-xl border-2 transition-all ${provider === 'gemini'
                                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-lg shadow-amber-500/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700'
                                    }`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <Bot className={`w-8 h-8 ${provider === 'gemini' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
                                    <span className={`text-sm font-bold ${provider === 'gemini' ? 'text-amber-700 dark:text-amber-300' : 'text-slate-600 dark:text-slate-400'}`}>
                                        Google Gemini
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-500">gemini-1.5-flash</span>
                                </div>
                                {provider === 'gemini' && (
                                    <div className="absolute top-2 right-2 w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                                )}
                            </button>
                            <button
                                onClick={() => setProvider('openrouter')}
                                className={`relative p-4 rounded-xl border-2 transition-all ${provider === 'openrouter'
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg shadow-indigo-500/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                                    }`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <Cpu className={`w-8 h-8 ${provider === 'openrouter' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                                    <span className={`text-sm font-bold ${provider === 'openrouter' ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'}`}>
                                        OpenRouter
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-500">Llama 3.3 70B</span>
                                </div>
                                {provider === 'openrouter' && (
                                    <div className="absolute top-2 right-2 w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* API Key Input */}
                    <div className="space-y-3">
                        {provider === 'gemini' ? (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                                    🔑 Gemini API Key
                                </label>
                                <div className="bg-amber-50 dark:bg-slate-900 p-4 rounded-xl border-2 border-amber-200 dark:border-amber-800">
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 font-medium">
                                        👇 Paste API Key di sini:
                                    </p>
                                    <div className="relative">
                                        <input
                                            type={showKey ? "text" : "password"}
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder="AIza..."
                                            className="w-full px-4 py-3 pr-24 rounded-lg border-2 border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm font-mono"
                                        />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                            {apiKey && (
                                                <button type="button" onClick={() => setApiKey('')} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setShowKey(!showKey)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                            >
                                                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800/50">
                                    <p className="text-xs text-blue-700 dark:text-blue-400">
                                        💡 Dapatkan API key gratis di <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-blue-900 dark:hover:text-blue-200">Google AI Studio</a>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                                    🔑 OpenRouter API Key
                                </label>
                                <div className="bg-indigo-50 dark:bg-slate-900 p-4 rounded-xl border-2 border-indigo-200 dark:border-indigo-800">
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 font-medium">
                                        👇 Paste API Key di sini:
                                    </p>
                                    <div className="relative">
                                        <input
                                            type={showKey ? "text" : "password"}
                                            value={openRouterKey}
                                            onChange={(e) => setOpenRouterKey(e.target.value)}
                                            placeholder="sk-or-..."
                                            className="w-full px-4 py-3 pr-24 rounded-lg border-2 border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-mono"
                                        />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                            {openRouterKey && (
                                                <button type="button" onClick={() => setOpenRouterKey('')} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setShowKey(!showKey)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                            >
                                                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800/50">
                                    <p className="text-xs text-indigo-700 dark:text-indigo-400">
                                        💡 Dapatkan API key di <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-indigo-900 dark:hover:text-indigo-200">OpenRouter.ai</a>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-3 shrink-0 rounded-b-2xl">
                    {isSaved ? (
                        <button
                            onClick={handleClear}
                            className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Hapus Semua
                        </button>
                    ) : (
                        <div></div>
                    )}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!apiKey.trim() && !openRouterKey.trim()}
                            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/30"
                        >
                            <Save className="w-4 h-4" />
                            Simpan Pengaturan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiKeySettings;
