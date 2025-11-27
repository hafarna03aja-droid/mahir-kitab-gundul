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

    // Ambil email user yang sedang login
    const userEmail = session?.user?.email;

    useEffect(() => {
        async function getProfile() {
            setLoading(true);
            const { user } = session;

            const { data } = await supabase
                .from('profiles')
                .select('status')
                .eq('id', user.id)
                .single();

            if (data) setProfile(data);
            setLoading(false);
        }

        getProfile();
    }, [session]);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Memeriksa status akun...</div>;

    // --- TAMPILAN JIKA BELUM BAYAR (FREE) ---
    if (!profile || profile.status === 'free') {
        return (
            <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>

                {/* Ikon Gembok */}
                <div style={{ fontSize: '50px', marginBottom: '20px' }}>🔒</div>

                <h1>Akses Premium Diperlukan</h1>
                <p>Maaf, fitur ini khusus untuk member Premium. Silakan lakukan upgrade untuk melanjutkan.</p>

                {/* --- KOTAK PERINGATAN EMAIL (PENTING) --- */}
                <div style={{
                    backgroundColor: '#fff3cd', // Warna kuning lembut
                    border: '1px solid #ffeeba',
                    color: '#856404',
                    padding: '20px',
                    borderRadius: '10px',
                    margin: '30px 0',
                    textAlign: 'left' // Rata kiri biar enak dibaca
                }}>
                    <strong>⚠️ INSTRUKSI PENTING:</strong>
                    <p style={{ margin: '10px 0' }}>
                        Saat mengisi formulir pembayaran, pastikan Anda menggunakan alamat email ini agar aktivasi berhasil otomatis:
                    </p>

                    {/* Menampilkan Email User */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '10px',
                        border: '2px dashed #d1d1d1',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        fontSize: '1.2em',
                        textAlign: 'center',
                        color: '#333'
                    }}>
                        {userEmail}
                    </div>

                    <p style={{ fontSize: '0.9em', marginTop: '10px', color: '#dc3545' }}>
                        *Jangan gunakan email lain, atau akun tidak akan aktif.
                    </p>
                </div>
                {/* ----------------------------------------- */}

                {/* Tombol ke Mayar */}
                {/* GANTI LINK DI BAWAH DENGAN LINK MAYAR ANDA SENDIRI */}
                <a
                    href="https://24learningcentre.myr.id/pl/mahir-arab-gundul"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        backgroundColor: '#2563eb', // Warna Biru
                        color: 'white',
                        padding: '15px 30px',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        display: 'inline-block',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                >
                    💳 Bayar & Aktifkan Sekarang
                </a>

                <br /><br />

                <button
                    onClick={() => supabase.auth.signOut()}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                    }}
                >
                    Logout / Keluar
                </button>
            </div>
        );
    }

    // --- TAMPILAN JIKA SUDAH PREMIUM ---
    return (
        <div style={{ padding: '20px' }}>
            <h1>🎉 Selamat Datang, Member Premium!</h1>
            <p>Status Akun: <span style={{ color: 'green', fontWeight: 'bold' }}>{profile.status.toUpperCase()}</span></p>
            <hr />
            {/* Masukkan Komponen Aplikasi Utama/Rahasia Anda di bawah ini */}
            <div style={{ marginTop: '20px' }}>
                <MainApp />
            </div>
        </div>
    );
}
