import React from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import CheckoutButton from './CheckoutButton';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all animate-in zoom-in-95 duration-200 relative"
                role="dialog"
                aria-modal="true"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-6 sm:p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-semibold mb-4">
                            <Sparkles className="w-4 h-4" />
                            <span>Penawaran Terbatas</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Upgrade ke Premium
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            Nikmati akses penuh tanpa batas
                        </p>
                    </div>

                    {/* Pricing Card */}
                    <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-xl border-2 border-amber-400 p-6 shadow-lg mb-6 relative overflow-hidden">
                        {/* Promo Badge */}
                        <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 px-3 py-1 text-xs font-bold rounded-bl-xl shadow-sm">
                            POPULER
                        </div>

                        {/* Price */}
                        <div className="text-center mb-6">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="text-slate-400 dark:text-slate-500 line-through text-lg">Rp 159.000</span>
                                <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded text-xs font-bold">
                                    HEMAT 69%
                                </span>
                            </div>
                            <div className="relative inline-block">
                                <span className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                    Rp 1.000
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                Sekali bayar • Akses selamanya (Lifetime)
                            </p>
                        </div>

                        {/* Features */}
                        <div className="space-y-3 mb-6">
                            {[
                                'Akses Full Fitur AI (Analisis I\'rab, dll)',
                                'Akses Perpustakaan Kitab Digital',
                                'Smart Caching (Super Cepat)',
                                'Update Fitur Berkala',
                                'Prioritas Support'
                            ].map((feature, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mt-0.5">
                                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* Checkout Button */}
                        <CheckoutButton
                            className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            onSuccess={() => {
                                // Close modal and refresh or update state
                                onClose();
                                window.location.reload();
                            }}
                        />
                        <p className="text-center text-[10px] text-slate-400 mt-3">
                            Pembayaran aman via Midtrans • Garansi 7 hari
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
