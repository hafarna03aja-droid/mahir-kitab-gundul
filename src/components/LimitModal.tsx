import React from 'react';

interface LimitModalProps {
    isOpen: boolean;
    type: 'daily' | 'monthly' | 'expired' | null;
    onClose: () => void;
    onUpgrade: () => void;
}

const LimitModal: React.FC<LimitModalProps> = ({ isOpen, type, onClose, onUpgrade }) => {
    if (!isOpen || !type) return null;

    const isDaily = type === 'daily';
    const isMonthly = type === 'monthly';
    const isLimit = isDaily || isMonthly;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
            <div
                className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className={`mb-5 p-3 rounded-full ${isLimit ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                        {isLimit ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        )}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {isDaily ? "Kuota Harian Tercapai" : isMonthly ? "Kuota Bulanan Tercapai" : "Langganan Berakhir"}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                        {isDaily
                            ? "Anda telah mencapai batas 100 request per hari. Kuota akan direset otomatis besok (UTC). Terima kasih telah menggunakan layanan kami!"
                            : isMonthly
                                ? "Anda telah mencapai batas 3000 request per bulan. Kuota akan direset otomatis bulan depan. Upgrade ke paket Unlimited untuk akses tanpa batas!"
                                : "Masa aktif langganan Anda telah berakhir. Perpanjang sekarang untuk terus menikmati fitur premium kami."
                        }
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        {isDaily ? (
                            <button
                                onClick={onClose}
                                className="w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                            >
                                Tutup
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={onClose}
                                    className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold rounded-lg transition-colors"
                                >
                                    Nanti Saja
                                </button>
                                <button
                                    onClick={onUpgrade}
                                    className="w-full px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors shadow-lg shadow-amber-500/20"
                                >
                                    {isMonthly ? "Upgrade Sekarang" : "Perpanjang Sekarang"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LimitModal;
