import { useState, useEffect, useRef } from 'react';
import { X, Save, Key, Trash2, Eye, EyeOff, Bot, Cpu, Router, Sparkles } from 'lucide-react';
import { getAIConfig, type AIProvider } from '../services/aiService';

interface ApiKeySettingsProps {
    isOpen: boolean;
    onClose: () => void;
    buttonRef?: React.RefObject<HTMLButtonElement>;
}

const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({ isOpen, onClose, buttonRef }) => {
    const [geminiKey, setGeminiKey] = useState('');
    const [openRouterKey, setOpenRouterKey] = useState('');
    const [maiaKey, setMaiaKey] = useState('');
    const [openaiKey, setOpenaiKey] = useState('');
    const [provider, setProvider] = useState<AIProvider>('gemini');

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
            const config = getAIConfig();

            // Load all keys from storage
            setGeminiKey(localStorage.getItem('gemini_api_key') || '');
            setOpenRouterKey(localStorage.getItem('openrouter_api_key') || '');
            setMaiaKey(localStorage.getItem('maia_api_key') || '');
            setOpenaiKey(localStorage.getItem('openai_api_key') || '');

            setProvider(config.provider);

            const hasAnyKey = !!localStorage.getItem('gemini_api_key') ||
                !!localStorage.getItem('openrouter_api_key') ||
                !!localStorage.getItem('maia_api_key') ||
                !!localStorage.getItem('openai_api_key');

            setIsSaved(hasAnyKey);

            // Responsive & Positioning Logic
            const checkMobile = () => window.innerWidth < 640;
            setIsMobile(checkMobile());

            if (buttonRef?.current) {
                const buttonRect = buttonRef.current.getBoundingClientRect();
                const popoverWidth = 500;
                const popoverHeight = 600;
                const margin = 15;
                const isMobileView = checkMobile();

                if (isMobileView) {
                    const left = Math.max(10, (window.innerWidth - popoverWidth) / 2);
                    const top = Math.max(10, (window.innerHeight - popoverHeight) / 2);
                    setPopoverPosition({ top, left });
                    setArrowDirection('left');
                } else {
                    let left = buttonRect.right + margin;
                    let top = buttonRect.top;
                    let direction: 'left' | 'right' = 'left';

                    if (left + popoverWidth > window.innerWidth - 10) {
                        left = buttonRect.left - popoverWidth - margin;
                        direction = 'right';
                    }

                    if (top < 10) top = 10;
                    if (top + popoverHeight > window.innerHeight) {
                        top = Math.max(10, window.innerHeight - popoverHeight - 10);
                    }

                    if (left < 10) {
                        left = 10;
                        direction = 'left';
                    }

                    setPopoverPosition({ top, left });
                    setArrowDirection(direction);
                }
            }
        }

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
        if (geminiKey.trim()) localStorage.setItem('gemini_api_key', geminiKey.trim());
        if (openRouterKey.trim()) localStorage.setItem('openrouter_api_key', openRouterKey.trim());
        if (maiaKey.trim()) localStorage.setItem('maia_api_key', maiaKey.trim());
        if (openaiKey.trim()) localStorage.setItem('openai_api_key', openaiKey.trim());

        localStorage.setItem('ai_provider', provider);

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
        localStorage.setItem('ai_provider', 'gemini'); // Default back to Gemini

        setGeminiKey('');
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
            <div className="fixed inset-0 z-[99] bg-black/20 animate-in fade-in duration-200" onClick={onClose} />
            <div
                ref={popoverRef}
                style={{ top: `${popoverPosition.top}px`, left: `${popoverPosition.left}px` }}
                className={`fixed z-[100] ${isMobile ? 'w-[calc(100vw-20px)] max-w-[500px]' : 'w-[500px]'} animate-in ${arrowDirection === 'left' ? 'slide-in-from-right-4' : 'slide-in-from-left-4'} fade-in duration-300`}
            >
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-h-[85vh] flex flex-col relative">
                    {/* Arrow */}
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
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div ref={modalBodyRef} className="p-6 space-y-5 overflow-y-auto">
                        <div className="space-y-3">
                            <label ref={topLabelRef} className="text-sm font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wide">
                                🤖 Pilih AI Provider
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'gemini', name: 'Google Gemini', icon: Bot, color: 'amber' },
                                    { id: 'openai', name: 'OpenAI', icon: Sparkles, color: 'teal' },
                                    { id: 'openrouter', name: 'OpenRouter', icon: Cpu, color: 'indigo' },
                                    { id: 'maia', name: 'Maia Router', icon: Router, color: 'emerald' },
                                ].map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setProvider(p.id as AIProvider)}
                                        className={`relative p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${provider === p.id
                                                ? `border-${p.color}-500 bg-${p.color}-50 dark:bg-${p.color}-900/20 shadow-lg`
                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                            }`}
                                    >
                                        <p.icon className={`w-6 h-6 ${provider === p.id ? `text-${p.color}-600 dark:text-${p.color}-400` : 'text-slate-400'}`} />
                                        <span className={`text-xs font-bold ${provider === p.id ? `text-${p.color}-700 dark:text-${p.color}-300` : 'text-slate-600'}`}>
                                            {p.name}
                                        </span>
                                        {provider === p.id && <div className={`absolute top-2 right-2 w-2 h-2 bg-${p.color}-500 rounded-full animate-pulse`} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Config Inputs */}
                        <div className="space-y-4">
                            {/* Gemini */}
                            {provider === 'gemini' && (
                                <APIKeyInput
                                    label="🔑 Google AI Studio API Key"
                                    value={geminiKey}
                                    onChange={setGeminiKey}
                                    placeholder="AIza..."
                                    show={showKey}
                                    toggleShow={() => setShowKey(!showKey)}
                                    color="amber"
                                    hint={<>Dapatkan gratis di <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline">Google AI Studio</a></>}
                                />
                            )}

                            {/* OpenAI */}
                            {provider === 'openai' && (
                                <APIKeyInput
                                    label="🔑 OpenAI API Key"
                                    value={openaiKey}
                                    onChange={setOpenaiKey}
                                    placeholder="sk-..."
                                    show={showKey}
                                    toggleShow={() => setShowKey(!showKey)}
                                    color="teal"
                                    hint={<>Dapatkan di <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="underline">OpenAI Platform</a></>}
                                />
                            )}

                            {/* OpenRouter */}
                            {provider === 'openrouter' && (
                                <APIKeyInput
                                    label="🔑 OpenRouter API Key"
                                    value={openRouterKey}
                                    onChange={setOpenRouterKey}
                                    placeholder="sk-or-..."
                                    show={showKey}
                                    toggleShow={() => setShowKey(!showKey)}
                                    color="indigo"
                                    hint={<>Dapatkan di <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className="underline">OpenRouter</a></>}
                                />
                            )}

                            {/* Maia */}
                            {provider === 'maia' && (
                                <APIKeyInput
                                    label="🔑 Maia Router API Key"
                                    value={maiaKey}
                                    onChange={setMaiaKey}
                                    placeholder="sk-..."
                                    show={showKey}
                                    toggleShow={() => setShowKey(!showKey)}
                                    color="emerald"
                                    hint={<>Dapatkan di <a href="https://api.maia.ai" target="_blank" rel="noreferrer" className="underline">Maia Router</a></>}
                                />
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-3 shrink-0 rounded-b-2xl">
                        {isSaved ? (
                            <button onClick={handleClear} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium flex items-center gap-2">
                                <Trash2 className="w-4 h-4" /> Hapus Semua
                            </button>
                        ) : <div />}

                        <div className="flex items-center gap-2">
                            <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">
                                Batal
                            </button>
                            <button onClick={handleSave} className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg">
                                <Save className="w-4 h-4" /> Simpan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Reusable Input Component to reduce clutter
const APIKeyInput = ({ label, value, onChange, placeholder, show, toggleShow, color, hint }: any) => (
    <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">{label}</label>
        <div className={`bg-${color}-50 dark:bg-slate-900 p-4 rounded-xl border-2 border-${color}-200 dark:border-${color}-800`}>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 pr-24 rounded-lg border-2 border-${color}-300 dark:border-${color}-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono`}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {value && <button onClick={() => onChange('')} className="p-1 text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>}
                    <button onClick={toggleShow} className="p-1 text-slate-400 hover:text-slate-600">
                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>
            {hint && <p className="text-xs text-slate-500 mt-2">{hint}</p>}
        </div>
    </div>
);

export default ApiKeySettings;
