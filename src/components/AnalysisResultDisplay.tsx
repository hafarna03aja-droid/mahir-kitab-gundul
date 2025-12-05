import { useState } from 'react';
import type { AnalysisResult } from '../types';

interface AnalysisResultDisplayProps {
    result: AnalysisResult;
}

const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125T8.25 4.5h5.69c.476 0 .93.064 1.372.184m0 3.192-3.876 3.876m0 0L8.25 7.688M12 11.562V4.5" />
    </svg>
);

const TxtIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

const DocIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6.75h1.5v3.75h-1.5V6.75Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75h.008v.008H12v-.008Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 12.75h.008v.008h-.008v-.008Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 12.75h.008v.008h-.008v-.008Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 15h1.5v1.5h-1.5V15Z" />
    </svg>
);

const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result }) => {
    const [isCopied, setIsCopied] = useState(false);

    const generateMarkdownForCopy = (res: AnalysisResult): string => {
        let md = `# Analisis Teks: Kitab Gundul AI\n\n`;
        md += `## Teks Asli (Gundul)\n`;
        md += `\`\`\`ar\n${res.originalText}\n\`\`\`\n\n`;
        md += `## Teks Bervokal (Tashkeel)\n`;
        md += `> ${res.vocalizedText}\n\n`;
        md += `## Terjemahan Indonesia\n`;
        md += `> _"${res.translation}"_\n\n`;
        md += `--- \n\n`;
        md += `## Analisis Gramatikal Mendalam\n\n`;
        
        res.irab.forEach(entry => {
            md += `### Kata: ${entry.word}\n\n`;
            if (entry.vocalized_word) {
                md += `**Bervokal:** ${entry.vocalized_word}\n\n`;
            }
            md += `*   **I'rab (Tata Bahasa):** ${entry.analysis_details.i_rab}\n`;
            md += `*   **Sharaf (Morfologi):** ${entry.analysis_details.sharaf}\n`;
            md += `*   **Akar Kata:** \`${entry.analysis_details.root_word}\`\n`;
            if (entry.analysis_details.balaghah) {
                md += `*   **Balaghah (Retorika):** ${entry.analysis_details.balaghah}\n`;
            }
            md += `\n`;
        });
        
        return md;
    };

    const generateTxt = (res: AnalysisResult): string => {
        let txt = `Analisis Teks: Kitab Gundul AI\n`;
        txt += `===================================\n\n`;
        txt += `Teks Asli (Gundul):\n${res.originalText}\n\n`;
        txt += `Teks Bervokal (Tashkeel):\n${res.vocalizedText}\n\n`;
        txt += `Terjemahan Indonesia:\n"${res.translation}"\n\n`;
        txt += `-----------------------------------\n`;
        txt += `Analisis Gramatikal Mendalam\n`;
        txt += `-----------------------------------\n\n`;
        
        res.irab.forEach(entry => {
            txt += `Kata: ${entry.word}\n`;
            if (entry.vocalized_word) {
                txt += `Bervokal: ${entry.vocalized_word}\n`;
            }
            txt += `  - I'rab (Tata Bahasa): ${entry.analysis_details.i_rab}\n`;
            txt += `  - Sharaf (Morfologi): ${entry.analysis_details.sharaf}\n`;
            txt += `  - Akar Kata: ${entry.analysis_details.root_word}\n`;
            if (entry.analysis_details.balaghah) {
                txt += `  - Balaghah (Retorika): ${entry.analysis_details.balaghah}\n`;
            }
            txt += `\n`;
        });
        
        return txt;
    };

    const generateDocHtml = (res: AnalysisResult): string => {
        let html = `
            <!DOCTYPE html>
            <html lang="id">
            <head>
                <meta charset="UTF-8">
                <title>Analisis Teks - Mahir Kitab Gundul</title>
                <style>
                    body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; }
                    .container { max-width: 800px; margin: auto; padding: 20px; }
                    h1 { font-size: 24pt; color: #2c3e50; }
                    h2 { font-size: 18pt; color: #34495e; border-bottom: 2px solid #f39c12; padding-bottom: 5px; margin-top: 20px; }
                    h3 { font-size: 16pt; color: #34495e; }
                    p, div { margin-bottom: 10px; }
                    .arabic { direction: rtl; text-align: right; font-family: 'Arial', sans-serif; font-size: 20pt; }
                    .translation { font-style: italic; color: #555; border-left: 3px solid #bdc3c7; padding-left: 10px; }
                    .analysis-card { border: 1px solid #ddd; border-radius: 5px; padding: 15px; margin-bottom: 15px; background-color: #fdfdfd; }
                    .detail-item { margin-bottom: 8px; }
                    .detail-label { font-weight: bold; color: #7f8c8d; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Analisis Teks: Kitab Gundul AI</h1>
                    
                    <h2>Teks Asli (Gundul)</h2>
                    <p class="arabic">${res.originalText}</p>
                    
                    <h2>Teks Bervokal (Tashkeel)</h2>
                    <p class="arabic">${res.vocalizedText}</p>
                    
                    <h2>Terjemahan Indonesia</h2>
                    <p class="translation">"${res.translation}"</p>
                    
                    <hr style="margin: 30px 0;" />
                    
                    <h2>Analisis Gramatikal Mendalam</h2>
        `;

        res.irab.forEach(entry => {
            html += `
                <div class="analysis-card">
                    <h3>Kata: <span class="arabic">${entry.word}</span></h3>
                    ${entry.vocalized_word ? `<p class="arabic" style="color: #f39c12; font-size: 18pt;">${entry.vocalized_word}</p>` : ''}
                    <div class="detail-item"><span class="detail-label">I'rab (Tata Bahasa):</span> ${entry.analysis_details.i_rab}</div>
                    <div class="detail-item"><span class="detail-label">Sharaf (Morfologi):</span> ${entry.analysis_details.sharaf}</div>
                    <div class="detail-item"><span class="detail-label">Akar Kata:</span> ${entry.analysis_details.root_word}</div>
                    ${entry.analysis_details.balaghah ? `<div class="detail-item"><span class="detail-label">Balaghah (Retorika):</span> ${entry.analysis_details.balaghah}</div>` : ''}
                </div>
            `;
        });

        html += `
                </div>
            </body>
            </html>
        `;
        return html;
    };

    const handleCopy = () => {
        const markdownText = generateMarkdownForCopy(result);
        navigator.clipboard.writeText(markdownText).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const handleExport = (format: 'txt' | 'doc') => {
        let blob: Blob;
        let filename: string;

        if (format === 'txt') {
            const textContent = generateTxt(result);
            blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
            filename = 'analisis-kitab-gundul.txt';
        } else { // doc
            const htmlContent = generateDocHtml(result);
            const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML to Word</title></head><body>";
            const footer = "</body></html>";
            const sourceHTML = header + htmlContent + footer;
            blob = new Blob([sourceHTML], { type: 'application/msword' });
            filename = 'analisis-kitab-gundul.doc';
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <span className="text-sm font-semibold text-slate-700">Opsi Hasil:</span>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                        <CopyIcon className="w-4 h-4" />
                        {isCopied ? 'Tersalin!' : 'Salin Hasil'}
                    </button>
                    <button 
                        onClick={() => handleExport('txt')}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                        <TxtIcon className="w-4 h-4" />
                        Ekspor ke .txt
                    </button>
                    <button 
                        onClick={() => handleExport('doc')}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                        <DocIcon className="w-4 h-4" />
                        Ekspor ke .doc
                    </button>
                </div>
            </div>

            {/* Teks Asli (Gundul) */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 border-b-2 border-amber-400 pb-2 mb-4">
                    Teks Asli (Gundul)
                </h3>
                <p className="text-right font-arabic text-3xl bg-slate-50 p-4 rounded-md leading-relaxed" dir="rtl">
                    {result.originalText}
                </p>
            </div>

            {/* Teks Bervokal */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 border-b-2 border-amber-400 pb-2 mb-4">
                    Teks Bervokal (Tashkeel)
                </h3>
                <p className="text-right font-arabic text-3xl bg-slate-50 p-4 rounded-md leading-relaxed" dir="rtl">
                    {result.vocalizedText}
                </p>
            </div>

            {/* Terjemahan */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 border-b-2 border-amber-400 pb-2 mb-4">
                    Terjemahan Indonesia
                </h3>
                <p className="text-slate-700 bg-slate-50 p-4 rounded-md italic">
                    {result.translation ? `"${result.translation}"` : <span className="text-slate-400">[Terjemahan tidak tersedia]</span>}
                </p>
            </div>

            {/* Analisis Gramatikal */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 border-b-2 border-amber-400 pb-2 mb-4">
                    Analisis Gramatikal Mendalam
                </h3>
                <div className="space-y-4">
                    {result.irab.map((entry, index) => {
                        const i_rab_text = entry.analysis_details.i_rab;
                        const separatorRegex = /(, yaitu|: | adalah|, yang berfungsi sebagai|, dengan makna|, yang berarti)/;
                        const parts = i_rab_text.split(separatorRegex);

                        return (
                            <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-4 sm:p-5 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-amber-400/50">
                                <div className="text-right mb-4 border-b border-slate-200 pb-3">
                                    <h4 className="font-arabic text-4xl font-bold text-slate-900">{entry.word}</h4>
                                    {entry.vocalized_word && (
                                        <p className="font-arabic text-2xl text-amber-600 mt-2" dir="rtl">
                                            {entry.vocalized_word}
                                        </p>
                                    )}
                                    {entry.word_translation && (
                                        <p className="text-sm text-slate-600 italic mt-2 text-left">
                                            Artinya: <span className="font-semibold text-amber-700">{entry.word_translation}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {/* I'rab Section */}
                                    <div className="flex flex-col sm:flex-row sm:items-start">
                                        <span className="flex-shrink-0 bg-sky-100 text-sky-800 text-xs font-semibold px-3 py-1 rounded-full mr-3 mb-2 sm:mb-0 sm:mt-1 w-max">
                                            I'rab (Tata Bahasa)
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-slate-800 text-xl leading-relaxed font-medium">
                                                {parts.length > 1 ? (
                                                    <>
                                                        <span>{parts[0]}</span>
                                                        <br />
                                                        <span className="text-slate-700 text-lg">
                                                            {parts.slice(1).join('').trim()}
                                                        </span>
                                                    </>
                                                ) : (
                                                    i_rab_text
                                                )}
                                            </p>
                                            {entry.analysis_details.i_rab_translation && (
                                                <p className="text-base text-slate-700 mt-3 bg-sky-50 p-3 rounded border-l-3 border-sky-400 leading-relaxed">
                                                    📝 {entry.analysis_details.i_rab_translation}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sharaf Section */}
                                    <div className="flex flex-col sm:flex-row sm:items-start">
                                        <span className="flex-shrink-0 bg-teal-100 text-teal-800 text-xs font-semibold px-3 py-1 rounded-full mr-3 mb-2 sm:mb-0 sm:mt-1 w-max">
                                            Sharaf (Morfologi)
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-slate-800 text-xl leading-relaxed font-medium">{entry.analysis_details.sharaf}</p>
                                            {entry.analysis_details.sharaf_translation && (
                                                <p className="text-base text-slate-700 mt-3 bg-teal-50 p-3 rounded border-l-3 border-teal-400 leading-relaxed">
                                                    📝 {entry.analysis_details.sharaf_translation}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Akar Kata Section */}
                                    <div className="flex flex-col sm:flex-row sm:items-start">
                                        <span className="flex-shrink-0 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full mr-3 mb-2 sm:mb-0 sm:mt-1 w-max">
                                            Akar Kata
                                        </span>
                                        <p className="text-slate-900 text-xl font-mono tracking-widest font-semibold">{entry.analysis_details.root_word}</p>
                                    </div>

                                    {/* Balaghah Section */}
                                    {entry.analysis_details.balaghah && (
                                        <div className="flex flex-col sm:flex-row sm:items-start">
                                            <span className="flex-shrink-0 bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full mr-3 mb-2 sm:mb-0 sm:mt-1 w-max">
                                                Balaghah (Retorika)
                                            </span>
                                            <p className="text-slate-700 text-lg leading-relaxed">{entry.analysis_details.balaghah}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default AnalysisResultDisplay;
