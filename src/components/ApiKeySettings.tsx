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
            // Optional: Show a toast or notification
            alert('API Key berhasil disimpan!');
            window.location.reload(); // Reload to ensure all services pick up the new key
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                            <Key className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pengaturan API Key</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Gemini API Key
                        </label>
                        <div className="relative">
                            <input
                                type={showKey ? "text" : "password"}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Masukkan API Key Anda (AIza...)"
                                className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowKey(!showKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            API Key akan disimpan di browser Anda (localStorage) dan digunakan untuk mengakses layanan AI.
                        </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
                        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">Cara mendapatkan API Key:</h4>
                        <ol className="text-xs text-blue-700 dark:text-blue-400 list-decimal list-inside space-y-1">
                            <li>Kunjungi <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900 dark:hover:text-blue-200">Google AI Studio</a></li>
                            <li>Login dengan akun Google Anda</li>
                            <li>Klik "Create API key"</li>
                            <li>Salin key dan tempel di sini</li>
                        </ol>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-3">
                    {isSaved ? (
                        <button
                            onClick={handleClear}
                            className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Hapus Key
                        </button>
                    ) : (
                        <div></div> // Spacer
                    )}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!apiKey.trim()}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
                        >
                            <Save className="w-4 h-4" />
                            Simpan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiKeySettings;
