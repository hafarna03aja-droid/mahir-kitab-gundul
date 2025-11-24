import React, { useState, useEffect } from 'react';
import { analyzeArabicText, convertToArabGundul } from '../services/aiService';
import { CATEGORIZED_EXAMPLES } from '../constants';
import type { AnalysisResult } from '../types';
import AnalysisResultDisplay from './AnalysisResultDisplay';

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-8 text-slate-500">
        <svg className="animate-spin h-8 w-8 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-center">AI sedang menganalisis teks... Mohon tunggu sejenak.</p>
    </div>
);

const AnalysisTab: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>(Object.keys(CATEGORIZED_EXAMPLES)[0]);
    const [indonesianInput, setIndonesianInput] = useState('');
    const [isConverting, setIsConverting] = useState(false);
    const [conversionError, setConversionError] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('analysisHistory');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (e) {
            console.error("Failed to parse history from localStorage", e);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('analysisHistory', JSON.stringify(history));
        } catch (e) {
            console.error("Failed to save history to localStorage", e);
        }
    }, [history]);

    const handleAnalyze = async (textToAnalyze: string = inputText) => {
        if (!textToAnalyze.trim()) {
            setError('Silakan masukkan teks Arab untuk dianalisis.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const analysisResult = await analyzeArabicText(textToAnalyze);
            setResult(analysisResult);
            // Add to history
            setHistory(prevHistory => {
                const newHistory = [textToAnalyze, ...prevHistory.filter(item => item !== textToAnalyze)];
                return newHistory.slice(0, 20); // Limit history to 20 items
            });
        } catch (err) {
            setError((err as Error).message || 'Terjadi kesalahan yang tidak diketahui.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConvert = async () => {
        if (!indonesianInput.trim()) {
            setConversionError('Silakan masukkan teks Indonesia untuk dikonversi.');
            return;
        }
        setIsConverting(true);
        setConversionError(null);
        try {
            const arabGundulText = await convertToArabGundul(indonesianInput);
            setInputText(arabGundulText);
        } catch (err) {
            setConversionError((err as Error).message || 'Terjadi kesalahan saat konversi.');
        } finally {
            setIsConverting(false);
        }
    };

    const handleHistoryClick = (text: string) => {
        setInputText(text);
        handleAnalyze(text);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6 sm:p-8 text-slate-800">
                <div className="prose prose-slate max-w-none">
                    <h2 className="text-2xl font-bold text-slate-900">Penganalisis Teks Arab</h2>
                    <p>
                        Masukkan teks Arab (dengan atau tanpa harakat) di bawah ini untuk mendapatkan analisis gramatikal (I'rab) yang mendalam, teks yang sudah divokalisasi, dan terjemahannya.
                    </p>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Pilih Contoh Teks dari Kategori:</label>
                    <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-3 mb-3">
                        {Object.keys(CATEGORIZED_EXAMPLES).map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:focus:ring-offset-slate-800 ${selectedCategory === category
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                        {CATEGORIZED_EXAMPLES[selectedCategory].map((example) => (
                            <button
                                key={example.label}
                                onClick={() => setInputText(example.text)}
                                className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm hover:bg-amber-100 dark:hover:bg-amber-900/30 border border-slate-200 dark:border-slate-600 transition-colors"
                            >
                                {example.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Alat Bantu: Konversi Teks Indonesia</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                        Ketik kalimat dalam Bahasa Indonesia, lalu klik konversi untuk membuat teks Arab gundulnya. Teks akan muncul di kotak utama di bawah untuk dianalisis.
                    </p>
                    <textarea
                        value={indonesianInput}
                        onChange={(e) => setIndonesianInput(e.target.value)}
                        placeholder="Contoh: 'ilmu itu adalah cahaya'..."
                        className="w-full h-24 p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-md focus:ring-amber-500 focus:border-amber-500 dark:focus:border-amber-400 text-base placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                    <div className="mt-2 flex justify-end">
                        <button
                            onClick={handleConvert}
                            disabled={isConverting}
                            className="px-5 py-2 bg-slate-600 text-white text-sm font-semibold rounded-md hover:bg-slate-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            {isConverting ? 'Mengonversi...' : 'Konversi ke Arab Gundul'}
                        </button>
                    </div>
                    {conversionError && (
                        <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                            <p><span className="font-bold">Error Konversi:</span> {conversionError}</p>
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-600 mb-2">Teks Arab untuk Dianalisis:</label>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="...اكتب النص العربي هنا أو اختر dari contoh/konversi di atas"
                        className="w-full h-48 p-4 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 font-arabic text-2xl text-right"
                        dir="rtl"
                        lang="ar"
                    />
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => handleAnalyze()}
                        disabled={isLoading}
                        className="px-6 py-3 bg-amber-500 text-white font-bold rounded-md hover:bg-amber-600 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center"
                    >
                        {isLoading ? 'Menganalisis...' : 'Analisis Teks'}
                    </button>
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                        <p><span className="font-bold">Error:</span> {error}</p>
                    </div>
                )}

                <div className="mt-8">
                    {isLoading && <LoadingSpinner />}
                    {result && <AnalysisResultDisplay result={result} />}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-24">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-3 mb-3">Riwayat Analisis</h3>
                {history.length > 0 ? (
                    <>
                        <ul className="space-y-2 max-h-96 overflow-y-auto">
                            {history.map((item, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => handleHistoryClick(item)}
                                        className="w-full text-right p-2 font-arabic text-md text-slate-700 rounded-md hover:bg-amber-50 transition-colors truncate"
                                    >
                                        {item}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => setHistory([])}
                            className="w-full mt-4 px-4 py-2 text-sm text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                        >
                            Bersihkan Riwayat
                        </button>
                    </>
                ) : (
                    <p className="text-sm text-slate-500 italic">Belum ada riwayat analisis.</p>
                )}
            </div>
        </div>
    );
};

export default AnalysisTab;
