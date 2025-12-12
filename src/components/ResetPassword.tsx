import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { BookOpen, Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResetPassword() {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Check for recovery token
    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const type = hashParams.get('type');

        if (type !== 'recovery') {
            setError('❌ Link reset password tidak valid atau sudah kadaluarsa.\\n\\nSilakan request link reset password yang baru.');
        }
    }, []);

    const validatePassword = () => {
        if (password.length < 6) {
            setError('❌ Password minimal 6 karakter');
            return false;
        }
        if (password !== confirmPassword) {
            setError('❌ Password tidak cocok. Silakan periksa kembali.');
            return false;
        }
        return true;
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!validatePassword()) {
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setMessage('✅ Password berhasil direset!\\n\\n🎉 Anda akan diarahkan ke aplikasi...');

            // Redirect to app after 2 seconds
            setTimeout(() => {
                navigate('/app');
            }, 2000);
        } catch (error: any) {
            setError('❌ Gagal reset password: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = () => {
        if (password.length === 0) return { strength: '', color: '' };
        if (password.length < 6) return { strength: 'Lemah', color: 'text-red-600' };
        if (password.length < 10) return { strength: 'Cukup', color: 'text-amber-600' };
        return { strength: 'Kuat', color: 'text-emerald-600' };
    };

    const passwordStrength = getPasswordStrength();

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
                            Reset Password
                        </h1>
                        <p className="text-emerald-50 text-sm">
                            Buat password baru untuk akun Anda
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        {error ? (
                            <div className="mb-6 p-4 rounded-xl text-sm text-left whitespace-pre-line leading-relaxed border-2 bg-red-50 border-red-200 text-red-900 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div>{error}</div>
                            </div>
                        ) : message ? (
                            <div className="mb-6 p-4 rounded-xl text-sm text-left whitespace-pre-line leading-relaxed border-2 bg-emerald-50 border-emerald-200 text-emerald-900 flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div>{message}</div>
                            </div>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-5">
                                {/* Password Input */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Password Baru
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Minimal 6 karakter"
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
                                    {password && (
                                        <p className={`mt-2 text-sm font-semibold ${passwordStrength.color}`}>
                                            Kekuatan: {passwordStrength.strength}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password Input */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Konfirmasi Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Ulangi password baru"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="w-full pl-12 pr-12 py-3.5 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-slate-900"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {confirmPassword && password === confirmPassword && (
                                        <p className="mt-2 text-sm font-semibold text-emerald-600 flex items-center gap-1">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Password cocok
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading || !password || !confirmPassword}
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Memproses...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span>Reset Password</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Back to Login Link */}
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => navigate('/app')}
                                className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline transition-colors"
                            >
                                ← Kembali ke Login
                            </button>
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
