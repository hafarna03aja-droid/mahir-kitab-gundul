import { useState, useEffect, useRef } from 'react';
import { X, Save, Key, Trash2, Eye, EyeOff, Bot, Cpu, Router, Sparkles } from 'lucide-react';
import { getActiveProvider, setActiveProvider, type AiProvider } from '../services/aiService';

interface ApiKeySettingsProps {
    isOpen: boolean;
    onClose: () => void;
    buttonRef?: React.RefObject<HTMLButtonElement>;
}

const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({ isOpen, onClose, buttonRef }) => {
    const [apiKey, setApiKey] = useState('');
    const [openRouterKey, setOpenRouterKey] = useState('');
    const [maiaKey, setMaiaKey] = useState('');
    const [openaiKey, setOpenaiKey] = useState('');
    const [provider, setProvider] = useState<AiProvider>('gemini');
    const [showKey, setShowKey] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
    const [arrowDirection, setArrowDirection] = useState<'left' | 'right'>('left');
    const [isMobile, setIsMobile] = useState(false);
    const modalBodyRef = useRef<HTMLDivElement>(null);
    const topLabelRef = useRef<HTMLLabelElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            const savedKey = localStorage.getItem('gemini_api_key');
            const savedOpenRouterKey = localStorage.getItem('openrouter_api_key');
            const savedMaiaKey = localStorage.getItem('maia_api_key');
            const savedOpenaiKey = localStorage.getItem('openai_api_key');
            const savedProvider = getActiveProvider();

            setApiKey(savedKey || '');
            setOpenRouterKey(savedOpenRouterKey || '');
            setMaiaKey(savedMaiaKey || '');
            setOpenaiKey(savedOpenaiKey || '');
            setProvider(savedProvider);

            setIsSaved(!!savedKey || !!savedOpenRouterKey || !!savedMaiaKey || !!savedOpenaiKey);

            // Check if mobile (for responsive handling)
            const checkMobile = () => window.innerWidth < 640;
            setIsMobile(checkMobile());

            // Calculate popover position based on button
            if (buttonRef?.current) {
                const buttonRect = buttonRef.current.getBoundingClientRect();
                const popoverWidth = 500;
                const popoverHeight = 600; // estimated max height
                const margin = 15;
                const isMobileView = checkMobile();

                if (isMobileView) {
                    // On mobile, center the popover
                    const left = Math.max(10, (window.innerWidth - popoverWidth) / 2);
                    const top = Math.max(10, (window.innerHeight - popoverHeight) / 2);
                    setPopoverPosition({ top, left });
                    setArrowDirection('left'); // default, won't be visible on mobile
                } else {
                    let left = buttonRect.right + margin;
                    let top = buttonRect.top;
                    let direction: 'left' | 'right' = 'left';

                    // Check if popover would overflow right edge
                    if (left + popoverWidth > window.innerWidth - 10) {
                        // Position to the left of button instead
                        left = buttonRect.left - popoverWidth - margin;
                        direction = 'right';
                    }

                    // Ensure popover doesn't overflow top
                    if (top < 10) top = 10;

                    // Ensure popover doesn't overflow bottom
                    if (top + popoverHeight > window.innerHeight) {
                        top = Math.max(10, window.innerHeight - popoverHeight - 10);
                    }

                    // Ensure popover doesn't overflow left
                    if (left < 10) {
                        left = 10;
                        direction = 'left';
                    }

                    setPopoverPosition({ top, left });
                    setArrowDirection(direction);
                }
            }

            // Scroll to top when modal opens
            setTimeout(() => {
                if (topLabelRef.current) {
                    topLabelRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
                } else if (modalBodyRef.current) {
                    modalBodyRef.current.scrollTop = 0;
                }
            }, 100);
        }

        // Click outside handler
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                if (buttonRef?.current && !buttonRef.current.contains(event.target as Node)) {
                    onClose();
                }
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, buttonRef, onClose]);

    const handleSave = () => {
        if (apiKey.trim()) localStorage.setItem('gemini_api_key', apiKey.trim());
        if (openRouterKey.trim()) localStorage.setItem('openrouter_api_key', openRouterKey.trim());
        if (maiaKey.trim()) localStorage.setItem('maia_api_key', maiaKey.trim());
        if (openaiKey.trim()) localStorage.setItem('openai_api_key', openaiKey.trim());

        setActiveProvider(provider);
        setIsSaved(true);
        onClose();
        alert('Pengaturan berhasil disimpan!');
        window.location.reload();
    };

    const handleClear = () => {
        localStorage.removeItem('gemini_api_key');
        localStorage.removeItem('openrouter_api_key');
        localStorage.removeItem('maia_api_key');
        localStorage.removeItem('openai_api_key');
        setApiKey('');
        setOpenRouterKey('');
        setMaiaKey('');
        setOpenaiKey('');
        setIsSaved(false);
        alert('Semua API Key berhasil dihapus.');
        window.location.reload();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop with reduced opacity */}
            <div
                className="fixed inset-0 z-[99] bg-black/20 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Popover Container */}
            <div
                ref={popoverRef}
                style={{
                    position: 'fixed',
                    top: `${popoverPosition.top}px`,
                    left: `${popoverPosition.left}px`,
                    zIndex: 100,
                }}
                className={`${isMobile ? 'w-[calc(100vw-20px)] max-w-[500px]' : 'w-[500px]'} animate-in ${arrowDirection === 'left' ? 'slide-in-from-right-4' : 'slide-in-from-left-4'} fade-in duration-300`}
            >
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-h-[85vh] flex flex-col relative">
                    {/* Arrow pointing to button - hidden on mobile */}
                    {!isMobile && arrowDirection === 'left' && (
                        <div className="absolute -left-3 top-4 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[12px] border-r-white dark:border-r-slate-800 drop-shadow-lg" />
                    )}
                    {!isMobile && arrowDirection === 'right' && (
                        <div className="absolute -right-3 top-4 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[12px] border-l-white dark:border-l-slate-800 drop-shadow-lg" />
                    )}
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
                    <div ref={modalBodyRef} className="p-6 space-y-5 overflow-y-auto">
                        {/* Provider Selection - Prominent */}
                        <div className="space-y-3">
                            <label ref={topLabelRef} className="text-sm font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wide">
                                🤖 Pilih AI Provider
                            </label>
                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={() => setProvider('gemini')}
                                    className={`relative p-3 rounded-xl border-2 transition-all ${provider === 'gemini'
                                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-lg shadow-amber-500/20'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700'
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <Bot className={`w-6 h-6 ${provider === 'gemini' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
                                        <span className={`text-xs font-bold ${provider === 'gemini' ? 'text-amber-700 dark:text-amber-300' : 'text-slate-600 dark:text-slate-400'}`}>
                                            Google AI Studio
                                        </span>
                                    </div>
                                    {provider === 'gemini' && (
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => setProvider('openrouter')}
                                    className={`relative p-3 rounded-xl border-2 transition-all ${provider === 'openrouter'
                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg shadow-indigo-500/20'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <Cpu className={`w-6 h-6 ${provider === 'openrouter' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                                        <span className={`text-xs font-bold ${provider === 'openrouter' ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'}`}>
                                            OpenRouter
                                        </span>
                                    </div>
                                    {provider === 'openrouter' && (
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => setProvider('maia')}
                                    className={`relative p-3 rounded-xl border-2 transition-all ${provider === 'maia'
                                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg shadow-emerald-500/20'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <Router className={`w-6 h-6 ${provider === 'maia' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                                        <span className={`text-xs font-bold ${provider === 'maia' ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}`}>
                                            Maia Router
                                        </span>
                                    </div>
                                    {provider === 'maia' && (
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => setProvider('openai')}
                                    className={`relative p-3 rounded-xl border-2 transition-all ${provider === 'openai'
                                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 shadow-lg shadow-teal-500/20'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700'
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <Sparkles className={`w-6 h-6 ${provider === 'openai' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                                        <span className={`text-xs font-bold ${provider === 'openai' ? 'text-teal-700 dark:text-teal-300' : 'text-slate-600 dark:text-slate-400'}`}>
                                            OpenAI
                                        </span>
                                    </div>
                                    {provider === 'openai' && (
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* API Key Input */}
                        <div className="space-y-3">
                            {provider === 'gemini' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                                        🔑 Google AI Studio API Key
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
                                                className={`w-full px-4 py-3 pr-24 rounded-lg border-2 ${apiKey && !apiKey.startsWith('AIza')
                                                    ? 'border-red-400 dark:border-red-600'
                                                    : 'border-amber-300 dark:border-amber-700'
                                                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm font-mono`}
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                                {apiKey && (
                                                    <>
                                                        {apiKey.startsWith('AIza') && apiKey.length >= 30 ? (
                                                            <span className="text-green-500 text-xs mr-1">✓</span>
                                                        ) : (
                                                            <span className="text-red-500 text-xs mr-1">✗</span>
                                                        )}
                                                        <button type="button" onClick={() => setApiKey('')} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
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
                                        {apiKey && !apiKey.startsWith('AIza') && (
                                            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                                                ⚠️ API Key Gemini biasanya dimulai dengan "AIza"
                                            </p>
                                        )}
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800/50">
                                        <p className="text-xs text-blue-700 dark:text-blue-400 mb-2">
                                            💡 Dapatkan API key gratis di <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-blue-900 dark:hover:text-blue-200">Google AI Studio</a>
                                        </p>
                                        <details className="text-xs text-blue-600 dark:text-blue-400">
                                            <summary className="cursor-pointer font-semibold hover:text-blue-800 dark:hover:text-blue-200">
                                                ℹ️ Perbedaan Free vs Paid Tier
                                            </summary>
                                            <div className="mt-2 space-y-1 pl-4">
                                                <p>• <strong>Free Tier:</strong> 15 req/menit, 1500 req/hari</p>
                                                <p>• <strong>Paid Tier:</strong> Rate limit lebih tinggi, akses model premium</p>
                                                <p>• Kedua tier menggunakan format API key yang sama</p>
                                            </div>
                                        </details>
                                    </div>
                                </div>
                            )}

                            {provider === 'openrouter' && (
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

                            {provider === 'maia' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                                        🔑 Maia Router API Key
                                    </label>
                                    <div className="bg-emerald-50 dark:bg-slate-900 p-4 rounded-xl border-2 border-emerald-200 dark:border-emerald-800">
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 font-medium">
                                            👇 Paste API Key di sini:
                                        </p>
                                        <div className="relative">
                                            <input
                                                type={showKey ? "text" : "password"}
                                                value={maiaKey}
                                                onChange={(e) => setMaiaKey(e.target.value)}
                                                placeholder="maia-..."
                                                className="w-full px-4 py-3 pr-24 rounded-lg border-2 border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm font-mono"
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                                {maiaKey && (
                                                    <button type="button" onClick={() => setMaiaKey('')} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
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
                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                                        <p className="text-xs text-emerald-700 dark:text-emerald-400">
                                            💡 Gunakan API Key dari Maia Router
                                        </p>
                                    </div>
                                </div>
                            )}

                            {provider === 'openai' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                                        🔑 OpenAI API Key
                                    </label>
                                    <div className="bg-teal-50 dark:bg-slate-900 p-4 rounded-xl border-2 border-teal-200 dark:border-teal-800">
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 font-medium">
                                            👇 Paste API Key di sini:
                                        </p>
                                        <div className="relative">
                                            <input
                                                type={showKey ? "text" : "password"}
                                                value={openaiKey}
                                                onChange={(e) => setOpenaiKey(e.target.value)}
                                                placeholder="sk-..."
                                                className="w-full px-4 py-3 pr-24 rounded-lg border-2 border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-sm font-mono"
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                                {openaiKey && (
                                                    <button type="button" onClick={() => setOpenaiKey('')} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
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
                                    <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg border border-teal-200 dark:border-teal-800/50">
                                        <p className="text-xs text-teal-700 dark:text-teal-400">
                                            💡 Dapatkan API key di <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-teal-900 dark:hover:text-teal-200">OpenAI Platform</a>
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
                                disabled={!apiKey.trim() && !openRouterKey.trim() && !maiaKey.trim() && !openaiKey.trim()}
                                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/30"
                            >
                                <Save className="w-4 h-4" />
                                Simpan Pengaturan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ApiKeySettings;
