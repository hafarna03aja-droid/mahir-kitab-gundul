import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import MainApp from './components/MainApp';
import { Session } from '@supabase/supabase-js';

interface DashboardAppProps {
    session: Session;
}

interface Profile {
    status: string;
    subscription_expires_at: string | null;
}

export default function DashboardApp({ session }: DashboardAppProps) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [checking, setChecking] = useState(false);
    const [autoCheckCount, setAutoCheckCount] = useState(0);

    // Initial load - get profile silently without alerts
    const getProfile = async (silent: boolean = true) => {
        if (!silent) setLoading(true);
        const { user } = session;

        try {
            console.log('Checking profile for user:', user.email);

            // PRIORITAS: Cek by email dulu (untuk payment-first users)
            let { data, error } = await supabase
                .from('profiles')
                .select('status, subscription_expires_at')
                .eq('email', user.email)
                .maybeSingle(); // PENTING: maybeSingle() tidak throw error jika tidak ada data

            console.log('Profile by email result:', { found: !!data, status: data?.status, error: error?.message });

            // Jika tidak ketemu by email, coba by user ID
            if (!data && !error) {
                console.log('Trying by user ID...');
                const result = await supabase
                    .from('profiles')
                    .select('status, subscription_expires_at')
                    .eq('id', user.id)
                    .maybeSingle(); // PENTING: maybeSingle() tidak throw error jika tidak ada data

                data = result.data;
                error = result.error;
                console.log('Profile by ID result:', { found: !!data, status: data?.status, error: error?.message });
            }

            // Jika ketemu profile, update dengan user ID (untuk link profile payment dengan account)
            if (data && user.email) {
                console.log('Found profile, updating with user ID...');
                await supabase
                    .from('profiles')
                    .update({ id: user.id, updated_at: new Date().toISOString() })
                    .eq('email', user.email);

                setProfile(data);
                console.log('Profile status:', data.status);

                // Jika premium, stop auto-check
                if (data.status === 'premium') {
                    setAutoCheckCount(999); // Stop auto-check
                }
            } else if (!error) {
                // Profile tidak ditemukan - auto create dengan status free
                console.log('No profile found, creating new profile...');
                const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert({
                        id: user.id,
                        email: user.email,
                        status: 'free',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .select()
                    .single();

                if (!createError && newProfile) {
                    console.log('New profile created:', newProfile);
                    setProfile(newProfile);
                } else {
                    console.error('Failed to create profile:', createError);
                }
            }
        } catch (error: any) {
            console.error('Error getting profile:', error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    // Manual check - with user feedback
    const checkStatus = async () => {
        setChecking(true);
        const { user } = session;

        try {
            console.log('🔍 Manual check status for:', user.email);
            console.log('🆔 User ID:', user.id);

            // PRIORITAS: Cek by email dulu (menggunakan maybeSingle untuk avoid error)
            let { data, error } = await supabase
                .from('profiles')
                .select('status, email, created_at')
                .eq('email', user.email)
                .maybeSingle(); // PENTING: maybeSingle() tidak throw error jika tidak ada data

            console.log('📧 Check status result (by email):', {
                found: !!data,
                status: data?.status,
                error: error?.message
            });

            // Fallback: coba by user ID jika tidak ketemu by email
            if (!data && !error) {
                console.log('🔄 Profile not found by email, trying by user ID...');
                const result = await supabase
                    .from('profiles')
                    .select('status, email, created_at')
                    .eq('id', user.id)
                    .maybeSingle(); // PENTING: maybeSingle() tidak throw error jika tidak ada data

                data = result.data;
                error = result.error;
                console.log('🆔 Check status result (by ID):', {
                    found: !!data,
                    status: data?.status,
                    error: error?.message
                });
            }

            // Jika ada error dari database (bukan just "not found")
            if (error) {
                throw error;
            }

            if (data) {
                console.log('✅ Profile found!', data);

                // Update profile dengan user ID untuk linking
                if (user.email) {
                    console.log('🔗 Linking profile with user ID...');
                    await supabase
                        .from('profiles')
                        .update({ id: user.id, updated_at: new Date().toISOString() })
                        .eq('email', user.email);
                }

                setProfile(data);

                if (data.status === 'premium') {
                    alert('✅ PEMBAYARAN TERKONFIRMASI!\n\nAkun Anda sekarang PREMIUM.\nAplikasi akan terbuka dalam 2 detik...');
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else {
                    alert('ℹ️ Status akun masih FREE.\n\nJika Anda baru saja membayar:\n• Tunggu 1-2 menit untuk konfirmasi webhook\n• Pastikan email login SAMA dengan email saat bayar\n• Coba klik tombol ini lagi\n\n📧 Email Anda: ' + user.email);
                }
            } else {
                // Profile benar-benar tidak ada - buat profile baru
                console.log('⚠️ Profile not found, creating new FREE profile...');

                const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert({
                        id: user.id,
                        email: user.email,
                        status: 'free',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .select()
                    .single();

                if (createError) {
                    console.error('❌ Failed to create profile:', createError);
                    throw createError;
                }

                console.log('✅ New profile created:', newProfile);
                setProfile(newProfile);

                alert('ℹ️ Profile dibuat dengan status FREE.\n\nJika Anda sudah melakukan pembayaran:\n1. Pastikan email yang digunakan SAMA: ' + user.email + '\n2. Tunggu 1-2 menit untuk konfirmasi webhook\n3. Klik "Cek Status Pembayaran" lagi\n\nJika masih FREE setelah 5 menit, hubungi admin dengan menyertakan email Anda.');
            }
        } catch (error: any) {
            console.error('❌ Error checking status:', error);
            alert('❌ Gagal memeriksa status.\n\nError: ' + (error.message || 'Unknown error') + '\n\nSilakan coba lagi atau hubungi admin.');
        } finally {
            setChecking(false);
        }
    };

    useEffect(() => {
        getProfile(false);
    }, [session]);

    // Auto-refresh untuk cek payment status setiap 5 detik (max 10x = 50 detik)
    useEffect(() => {
        if (profile?.status === 'premium' || autoCheckCount >= 10) {
            return; // Stop jika sudah premium atau sudah cek 10x
        }

        const interval = setInterval(() => {
            console.log('Auto-checking payment status... (attempt', autoCheckCount + 1, '/10)');
            getProfile(true); // Silent check
            setAutoCheckCount(prev => prev + 1);
        }, 5000); // Setiap 5 detik

        return () => clearInterval(interval);
    }, [profile?.status, autoCheckCount]);

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

    // --- TAMPILAN JIKA BELUM BAYAR (FREE) ATAU EXPIRED ---
    const isExpired = profile?.status === 'premium'
        && !!profile?.subscription_expires_at
        && new Date() > new Date(profile.subscription_expires_at);

    if (!profile || profile.status !== 'premium' || isExpired) {
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

                <h1 style={{ color: '#111827', marginBottom: '10px' }}>{isExpired ? 'Langganan Anda Sudah Berakhir' : 'Akses Premium Diperlukan'}</h1>
                <p style={{ color: '#6b7280', fontSize: '1.1rem', lineHeight: '1.6' }}>
                    {isExpired
                        ? <>Langganan 1 bulan Anda telah habis.<br />Silakan perpanjang untuk melanjutkan akses.</>
                        : <>Mohon maaf, aplikasi ini khusus untuk member Premium.<br />Silakan selesaikan pembayaran untuk mendapatkan akses penuh.</>
                    }
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
                    <strong style={{ display: 'block', marginBottom: '10px' }}>{isExpired ? '⚠️ Status Akun Anda: EXPIRED' : 'ℹ️ Status Akun Anda: FREE'}</strong>
                    <p style={{ margin: '0' }}>
                        {isExpired
                            ? 'Langganan Anda telah berakhir. Klik tombol di bawah untuk perpanjang akses.'
                            : <>Jika Anda sudah melakukan pembayaran, silakan klik tombol <strong>"Cek Status Pembayaran"</strong> di bawah ini. Pastikan Anda login dengan email yang sama saat membayar.</>
                        }
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button
                        onClick={checkStatus}
                        disabled={checking}
                        style={{
                            backgroundColor: checking ? '#9ca3af' : '#10b981',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            border: 'none',
                            cursor: checking ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        {checking ? '⏳ Memeriksa...' : '🔄 Cek Status Pembayaran'}
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
