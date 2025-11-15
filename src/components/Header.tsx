import React from 'react';
import { BookOpen } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
    return (
        <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 rounded-xl shadow-lg">
                            <BookOpen className="w-6 h-6 text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                Mahir Arab Gundul
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Platform Pembelajaran Bahasa Arab</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400 hidden sm:inline">Assalamu'alaikum</span>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
