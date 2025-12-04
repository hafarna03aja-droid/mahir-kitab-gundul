import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import MainApp from './components/MainApp';
import { Session } from '@supabase/supabase-js';

interface DashboardAppProps {
    session: Session;
}

interface Profile {
    status: string;
}

export default function DashboardApp({ session }: DashboardAppProps) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const checkStatus = async () => {
        setLoading(true);
        const { user } = session;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('status')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            if (data) {
                setProfile(data);
                if (data.status === 'premium') {
                    alert('✅ Pembayaran terkonfirmasi! Akun Anda sekarang PREMIUM.');
                } else {
                    alert('ℹ️ Status akun masih FREE.\n\nJika Anda baru saja membayar, mohon tunggu 1-2 menit dan coba lagi.\nPastikan email pembayaran SAMA dengan email login.');
                }
            }
        } catch (error: any) {
            console.error('Error checking status:', error);
            alert('Gagal memeriksa status. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkStatus();
    }, [session]);

    if (loading) return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f9fafb'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div className="spinner" style={{
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #10b981',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 20px'
                }}></div>
                <p style={{ color: '#6b7280' }}>Memeriksa status akun...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    );

    // --- TAMPILAN JIKA BELUM BAYAR (FREE) ---
    if (!profile || profile.status !== 'premium') {
        return (
            <div style={{
                maxWidth: '600px',
                margin: '50px auto',
                padding: '40px',
                textAlign: 'center',
                fontFamily: "'Segoe UI', sans-serif",
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
            }}>

                {/* Ikon Gembok */}
                <div style={{
                    fontSize: '60px',
                    marginBottom: '20px',
                    background: '#fee2e2',
                    width: '100px',
                    height: '100px',
                    lineHeight: '100px',
                    borderRadius: '50%',
                    margin: '0 auto 20px'
                }}>🔒</div>

                <h1 style={{ color: '#111827', marginBottom: '10px' }}>Akses Premium Diperlukan</h1>
                <p style={{ color: '#6b7280', fontSize: '1.1rem', lineHeight: '1.6' }}>
                    Mohon maaf, aplikasi ini khusus untuk member Premium.<br />
                    Silakan selesaikan pembayaran untuk mendapatkan akses penuh.
                </p>

                {/* --- KOTAK PERINGATAN EMAIL (PENTING) --- */}
                <div style={{
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#1e40af',
                    padding: '20px',
                    borderRadius: '12px',
                    margin: '30px 0',
                    textAlign: 'left'
                }}>
                    <strong style={{ display: 'block', marginBottom: '10px' }}>ℹ️ Status Akun Anda: FREE</strong>
                    <p style={{ margin: '0' }}>
                        Jika Anda sudah melakukan pembayaran, silakan klik tombol <strong>"Cek Status Pembayaran"</strong> di bawah ini. Pastikan Anda login dengan email yang sama saat membayar.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button
                        onClick={checkStatus}
                        style={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        🔄 Cek Status Pembayaran
                    </button>

                    <a
                        href="/"
                        style={{
                            backgroundColor: '#4b5563',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            fontSize: '1rem',
                            display: 'inline-block'
                        }}
                    >
                        💳 Lakukan Pembayaran
                    </a>
                </div>

                <div style={{ marginTop: '40px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                    <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: '10px' }}>Ingin ganti akun?</p>
                    <button
                        onClick={() => supabase.auth.signOut()}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.9rem'
                        }}
                    >
                        Logout / Keluar
                    </button>
                </div>
            </div>
        );
    }

    // --- TAMPILAN JIKA SUDAH PREMIUM ---
    return (
        <div style={{ padding: '20px' }}>
            <h1>🎉 Selamat Datang, Member Premium!</h1>
            <p>Status Akun: <span style={{ color: 'green', fontWeight: 'bold' }}>PRO</span></p>
            <hr />
            {/* Masukkan Komponen Aplikasi Utama/Rahasia Anda di bawah ini */}
            <div style={{ marginTop: '20px' }}>
                <MainApp />
            </div>
        </div>
    );
}
