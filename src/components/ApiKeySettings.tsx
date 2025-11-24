import React, { useState, useEffect } from 'react';
import { X, Save, Key, Trash2, Eye, EyeOff } from 'lucide-react';

interface ApiKeySettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({ isOpen, onClose }) => {
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const savedKey = localStorage.getItem('gemini_api_key');
            if (savedKey) {
                setApiKey(savedKey);
                setIsSaved(true);
            } else {
                setApiKey('');
                setIsSaved(false);
            }
        }
    }, [isOpen]);

    const handleSave = () => {
        if (apiKey.trim()) {
            localStorage.setItem('gemini_api_key', apiKey.trim());
            setIsSaved(true);
            onClose();
            alert('API Key berhasil disimpan!');
            window.location.reload();
        }
    };

    const handleClear = () => {
        localStorage.removeItem('gemini_api_key');
        setApiKey('');
        setIsSaved(false);
        alert('API Key berhasil dihapus dari penyimpanan lokal.');
        window.location.reload();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                            <Key className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Pengaturan API Key</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                            Gemini API Key
                        </label>

                        {/* Input field dengan border yang jelas */}
                        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border-2 border-amber-200 dark:border-amber-800">
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1.5 font-medium">
                                👇 Paste API Key di sini:
                            </p>
                            <div className="relative">
                                <input
                                    type={showKey ? "text" : "password"}
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="AIza..."
                                    className="w-full px-3 py-2 pr-28 rounded-lg border-2 border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    {apiKey && (
                                        <button
                                            type="button"
                                            onClick={() => setApiKey('')}
                                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                            title="Hapus"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            try {
                                                const text = await navigator.clipboard.readText();
                                                if (text) setApiKey(text);
                                            } catch (err) {
                                                console.error('Failed to read clipboard:', err);
                                                alert('Gagal membaca clipboard. Pastikan Anda memberikan izin.');
                                            }
                                        }}
                                        className="px-2 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 border border-amber-400 dark:border-amber-600 rounded hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                                        title="Tempel dari Clipboard"
                                    >
                                        Paste
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowKey(!showKey)}
                                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    >
                                        {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-lg border border-blue-100 dark:border-blue-800/50">
                        <p className="text-xs text-blue-700 dark:text-blue-400">
                            💡 Dapatkan API key gratis di <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-blue-900 dark:hover:text-blue-200">Google AI Studio</a>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-3">
                    {isSaved ? (
                        <button
                            onClick={handleClear}
                            className="px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Hapus
                        </button>
                    ) : (
                        <div></div>
                    )}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!apiKey.trim()}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
                        >
                            <Save className="w-3.5 h-3.5" />
                            Simpan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiKeySettings;
