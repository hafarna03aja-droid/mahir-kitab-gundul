import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

interface LoginProps {
    onPreviewMode?: () => void;
}

export default function Login({ onPreviewMode }: LoginProps) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState('');
    
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
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h1>{isSignUp ? 'Sign Up' : 'Login'}</h1>
            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <input
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '10px',
                        borderRadius: '5px',
                        border: 'none',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Login')}
                </button>
            </form>
            {message && (
                <div style={{ 
                    marginTop: '15px', 
                    padding: '15px', 
                    backgroundColor: message.includes('✅') ? '#d1fae5' : message.includes('⚠️') ? '#fef3c7' : '#fee2e2',
                    color: '#1f2937',
                    borderRadius: '8px',
                    fontSize: '14px',
                    textAlign: 'left',
                    whiteSpace: 'pre-line',
                    lineHeight: '1.6'
                }}>
                    {message}
                </div>
            )}
            
            {isSignUp && message.includes('📧 Silakan cek email') && (
                <div style={{ marginTop: '15px' }}>
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
                        style={{
                            padding: '8px 16px',
                            borderRadius: '5px',
                            border: '1px solid #2563eb',
                            backgroundColor: 'white',
                            color: '#2563eb',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        📧 Kirim Ulang Email Konfirmasi
                    </button>
                </div>
            )}
            
            <p style={{ marginTop: '20px' }}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setMessage('');
                    }}
                    style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {isSignUp ? 'Login' : 'Sign Up'}
                </button>
            </p>
            
            {!isSignUp && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fef3c7', borderRadius: '8px', fontSize: '14px' }}>
                    <strong>💡 Sudah bayar tapi belum punya akun?</strong>
                    <p style={{ margin: '5px 0 0 0' }}>Klik "Sign Up" dan buat akun dengan email yang sama saat pembayaran.</p>
                </div>
            )}

            {/* Preview Mode Button */}
            {onPreviewMode && (
                <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
                    <button
                        onClick={onPreviewMode}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '5px',
                            border: '2px solid #10b981',
                            backgroundColor: 'white',
                            color: '#10b981',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px'
                        }}
                    >
                        👁️ Preview Mode (Tanpa Login)
                    </button>
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                        Lihat aplikasi tanpa perlu login
                    </p>
                </div>
            )}

            <div style={{ marginTop: '30px', fontSize: '12px', color: '#666' }}>
                <Link to="terms" style={{ color: '#666', textDecoration: 'none', marginRight: '10px' }}>Syarat & Ketentuan</Link>
                |
                <Link to="privacy" style={{ color: '#666', textDecoration: 'none', marginLeft: '10px' }}>Kebijakan Privasi</Link>
            </div>
        </div>
    );
}
