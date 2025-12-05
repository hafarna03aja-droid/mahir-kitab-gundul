import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { BookOpen, Mail, Lock, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';

interface LoginProps {
    onPreviewMode?: () => void;
}

export default function Login({ onPreviewMode }: LoginProps) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // Check if email is pre-filled from payment
    useEffect(() => {
        const savedEmail = localStorage.getItem('user_email');
        if (savedEmail) {
            setEmail(savedEmail);
            setMessage('✅ Pembayaran berhasil! Silakan buat password untuk akun Anda.');
            setIsSignUp(true);
            // Clear the flag after setting
            localStorage.removeItem('user_email');
        }
    }, []);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (isSignUp) {
                // Check if user already has premium profile from payment BEFORE signup
                const { data: existingProfile } = await supabase
                    .from('profiles')
                    .select('status, subscription_expires_at')
                    .eq('email', email)
                    .single();
                
                // Sign up with options
                const signUpOptions: any = {
                    email,
                    password,
                    options: {
                        data: {
                            email: email,
                        }
                    }
                };

                // If user already paid, we can skip email confirmation
                if (existingProfile && existingProfile.status === 'premium') {
                    signUpOptions.options.emailRedirectTo = window.location.origin + '/app';
                }

                const { data, error } = await supabase.auth.signUp(signUpOptions);
                
                if (error) throw error;
                
                // Create or update profile
                if (data.user) {
                    if (existingProfile) {
                        // Update existing profile with user ID
                        await supabase
                            .from('profiles')
                            .update({ 
                                id: data.user.id,
                                updated_at: new Date().toISOString()
                            })
                            .eq('email', email);
                        
                        if (existingProfile.status === 'premium') {
                            const expiresAt = existingProfile.subscription_expires_at 
                                ? new Date(existingProfile.subscription_expires_at).toLocaleDateString('id-ID')
                                : 'Selamanya';
                            
                            setMessage(`✅ Akun Premium Berhasil Dibuat!\n\n🎉 Selamat! Akun Anda telah aktif.\n📧 Email: ${email}\n⏰ Berlaku hingga: ${expiresAt}\n\n${data.user.email_confirmed_at ? '✅ Email sudah terverifikasi.' : '📧 Silakan cek email untuk verifikasi (opsional).'}`);
                        } else {
                            setMessage('✅ Pendaftaran berhasil!\n\n📧 Silakan cek email Anda untuk link konfirmasi.\n\n💡 Tip: Cek folder Spam jika tidak ada di Inbox.');
                        }
                    } else {
                        // Create new free profile
                        await supabase
                            .from('profiles')
                            .insert({
                                id: data.user.id,
                                email: email,
                                status: 'free',
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString()
                            });
                        setMessage('✅ Pendaftaran berhasil!\n\n📧 Silakan cek email Anda untuk link konfirmasi.\n\n💡 Tip: Cek folder Spam jika tidak ada di Inbox.');
                    }
                } else {
                    // User might already exist
                    setMessage('⚠️ Akun mungkin sudah ada.\n\nSilakan coba Login atau gunakan "Lupa Password".');
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (error: any) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,191,36,0.1),transparent_50%)]" />
            
            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
                    {/* Header dengan Gradient */}
                    <div className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-8 text-center">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.2),transparent_50%)]" />
                        
                        {/* Logo */}
                        <div className="relative flex justify-center mb-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {isSignUp ? 'Buat Akun Baru' : 'Selamat Datang'}
                        </h1>
                        <p className="text-emerald-50 text-sm">
                            Mahir Arab Gundul
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <form onSubmit={handleAuth} className="space-y-5">
                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        placeholder="nama@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-12 py-3.5 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-slate-900"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        <span>{isSignUp ? 'Daftar Sekarang' : 'Masuk'}</span>
                                    </>
                                )}
                            </button>
                        </form>
                        {/* Message Alert */}
                        {message && (
                            <div className={`mt-5 p-4 rounded-xl text-sm text-left whitespace-pre-line leading-relaxed border-2 ${
                                message.includes('✅') 
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                                    : message.includes('⚠️') 
                                    ? 'bg-amber-50 border-amber-200 text-amber-900' 
                                    : 'bg-red-50 border-red-200 text-red-900'
                            }`}>
                                {message}
                            </div>
                        )}
                        
                        {/* Resend Email Button */}
                        {isSignUp && message.includes('📧 Silakan cek email') && (
                            <div className="mt-4">
                                <button
                                    onClick={async () => {
                                        setLoading(true);
                                        try {
                                            const { error } = await supabase.auth.resend({
                                                type: 'signup',
                                                email: email,
                                            });
                                            if (error) throw error;
                                            setMessage('✅ Email konfirmasi telah dikirim ulang!\n\nSilakan cek inbox atau folder spam Anda.');
                                        } catch (error: any) {
                                            setMessage('❌ Gagal mengirim ulang email: ' + error.message);
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    disabled={loading}
                                    className="w-full py-2.5 px-4 border-2 border-emerald-500 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-50"
                                >
                                    📧 Kirim Ulang Email Konfirmasi
                                </button>
                            </div>
                        )}
                        
                        {/* Switch Login/Signup */}
                        <div className="mt-6 text-center">
                            <p className="text-slate-600">
                                {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
                                <button
                                    onClick={() => {
                                        setIsSignUp(!isSignUp);
                                        setMessage('');
                                    }}
                                    className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline transition-colors"
                                >
                                    {isSignUp ? 'Login' : 'Daftar'}
                                </button>
                            </p>
                        </div>
                        
                        {/* Info Box for Payment Users */}
                        {!isSignUp && (
                            <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-xl">
                                <p className="text-amber-900 font-semibold text-sm flex items-start gap-2">
                                    <span className="text-lg">💡</span>
                                    <span>
                                        <strong>Sudah bayar tapi belum punya akun?</strong>
                                        <br />
                                        <span className="font-normal">Klik "Daftar" dan buat akun dengan email yang sama saat pembayaran.</span>
                                    </span>
                                </p>
                            </div>
                        )}

                        {/* Preview Mode Button */}
                        {onPreviewMode && (
                            <div className="mt-8 pt-6 border-t-2 border-slate-100">
                                <button
                                    onClick={onPreviewMode}
                                    className="w-full py-3 px-6 border-2 border-emerald-500 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all"
                                >
                                    👁️ Preview Mode (Tanpa Login)
                                </button>
                                <p className="text-xs text-slate-500 text-center mt-2">
                                    Lihat aplikasi tanpa perlu login
                                </p>
                            </div>
                        )}

                        {/* Footer Links */}
                        <div className="mt-8 pt-6 border-t-2 border-slate-100 text-center text-xs text-slate-500">
                            <Link to="terms" className="hover:text-emerald-600 transition-colors">Syarat & Ketentuan</Link>
                            <span className="mx-2">•</span>
                            <Link to="privacy" className="hover:text-emerald-600 transition-colors">Kebijakan Privasi</Link>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-emerald-200 rounded-full opacity-20 blur-3xl -z-10" />
                <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-amber-200 rounded-full opacity-20 blur-3xl -z-10" />
            </div>
        </div>
    );
}
