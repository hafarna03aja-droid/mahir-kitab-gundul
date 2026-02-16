import type { BeginnerAnalysisResult } from '../types';

interface BeginnerResultDisplayProps {
    result: BeginnerAnalysisResult;
}

const BeginnerResultDisplay: React.FC<BeginnerResultDisplayProps> = ({ result }) => {
    const handleCopy = async () => {
        const text = result.words.map(w => `${w.word} = ${w.meaning}`).join('\n');
        const fullText = `${result.originalText}\n\nTerjemahan: ${result.translation}\n\nArti Per-kata:\n${text}`;
        try {
            await navigator.clipboard.writeText(fullText);
        } catch {
            // fallback
        }
    };

    return (
        <div className="space-y-6">
            {/* Translation Section */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📖</span>
                    <h3 className="text-sm font-semibold text-emerald-800 uppercase tracking-wide">Terjemahan</h3>
                </div>
                <p className="text-slate-800 text-lg leading-relaxed">{result.translation}</p>
            </div>

            {/* Original Text */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📝</span>
                    <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Teks Asli</h3>
                </div>
                <p className="text-2xl font-arabic text-right text-slate-900 leading-loose" dir="rtl" lang="ar">
                    {result.originalText}
                </p>
            </div>

            {/* Word Cards Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🔤</span>
                    <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                        Arti Per-kata ({result.words.length} kata)
                    </h3>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-sm"
                    title="Salin semua arti per-kata"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Salin
                </button>
            </div>

            {/* Word Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {result.words.map((entry, index) => (
                    <div
                        key={index}
                        className="group relative bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-amber-300 hover:-translate-y-0.5 transition-all duration-200 cursor-default"
                    >
                        {/* Number Badge */}
                        <span className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                            {index + 1}
                        </span>

                        {/* Arabic Word with Harakat */}
                        <p
                            className="font-arabic text-xl text-center text-slate-900 mb-1 leading-relaxed"
                            dir="rtl"
                            lang="ar"
                        >
                            {entry.vocalized_word}
                        </p>

                        {/* Original word (without harakat) - shown smaller if different */}
                        {entry.vocalized_word !== entry.word && (
                            <p
                                className="font-arabic text-xs text-center text-slate-400 mb-2 pb-2 border-b border-slate-100 group-hover:border-amber-200 transition-colors"
                                dir="rtl"
                                lang="ar"
                            >
                                {entry.word}
                            </p>
                        )}
                        {entry.vocalized_word === entry.word && (
                            <div className="mb-2 pb-2 border-b border-slate-100 group-hover:border-amber-200 transition-colors" />
                        )}

                        {/* Indonesian Meaning */}
                        <p className="text-sm text-center text-slate-600 font-medium leading-snug">
                            {entry.meaning}
                        </p>
                    </div>
                ))}
            </div>

            {/* Reading Guide */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">💡</span>
                    <p className="text-sm text-amber-800">
                        <strong>Tips Membaca:</strong> Baca kartu dari <strong>kanan ke kiri</strong> sesuai urutan bacaan Arab.
                        Pahami arti setiap kata untuk memahami struktur kalimat secara perlahan.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BeginnerResultDisplay;
