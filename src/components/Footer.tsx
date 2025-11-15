import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 mt-auto shadow-sm transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="text-center">
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        © 2025 Mahir Arab Gundul. Platform pembelajaran Bahasa Arab didukung oleh 24 Learning Centre.
                    </p>
                    <p className="text-slate-500 dark:text-slate-500 text-xs mt-2 italic">
                        "Barangsiapa menempuh jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga"
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
