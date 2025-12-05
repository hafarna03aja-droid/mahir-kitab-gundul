import { useState, useRef, useEffect } from 'react';
import { BookOpen, Settings, LogOut, User, Crown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import ApiKeySettings from './ApiKeySettings';
import { supabase } from '../supabaseClient';

const Header: React.FC = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [userEmail, setUserEmail] = useState<string>('');
    const [userStatus, setUserStatus] = useState<'free' | 'premium'>('free');
    const settingsButtonRef = useRef<HTMLButtonElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Get user info
        const getUserInfo = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserEmail(user.email || '');
                
                // Get user status from profiles
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('status')
                    .eq('id', user.id)
                    .single();
                
                if (profile) {
                    setUserStatus(profile.status);
                }
            }
        };
        getUserInfo();

        // Close menu when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/app';
    };

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
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button
                            ref={settingsButtonRef}
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Pengaturan API Key"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                        <ThemeToggle />
                        
                        {/* User Menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Akun Saya"
                            >
                                <div className="relative">
                                    <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                    {userStatus === 'premium' && (
                                        <Crown className="w-3 h-3 text-amber-500 absolute -top-1 -right-1" />
                                    )}
                                </div>
                                <span className="text-sm text-slate-600 dark:text-slate-400 hidden md:inline max-w-[150px] truncate">
                                    {userEmail || 'User'}
                                </span>
                            </button>

                            {/* Dropdown Menu */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                            {userEmail}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {userStatus === 'premium' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                                                    <Crown className="w-3 h-3" />
                                                    Premium
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                                                    Free
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="p-2">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="font-semibold">Logout / Keluar</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ApiKeySettings
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                buttonRef={settingsButtonRef}
            />
        </header>
    );
};

export default Header;
