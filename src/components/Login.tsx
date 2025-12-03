import { useState } from 'react';
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

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage('Sign up successful! Please check your email for confirmation link.');
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
            {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
            <p style={{ marginTop: '20px' }}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {isSignUp ? 'Login' : 'Sign Up'}
                </button>
            </p>

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
