import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative group overflow-hidden rounded-full p-2 transition-all duration-300 hover:scale-110 bg-gradient-to-br from-amber-400 to-orange-500 dark:from-indigo-600 dark:to-purple-700 shadow-lg hover:shadow-xl"
            title={theme === 'light' ? 'Ganti ke Mode Gelap' : 'Ganti ke Mode Terang'}
            aria-label="Toggle theme"
        >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            
            {/* Icon container with rotation animation */}
            <div className="relative w-6 h-6 flex items-center justify-center">
                {theme === 'light' ? (
                    <Sun 
                        className="w-6 h-6 text-white transform transition-transform duration-300 group-hover:rotate-180" 
                        strokeWidth={2.5}
                    />
                ) : (
                    <Moon 
                        className="w-6 h-6 text-white transform transition-transform duration-300 group-hover:-rotate-12" 
                        strokeWidth={2.5}
                    />
                )}
            </div>

            {/* Ripple effect on click */}
            <span className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-100 transition-transform duration-200"></span>
        </button>
    );
};

export default ThemeToggle;
