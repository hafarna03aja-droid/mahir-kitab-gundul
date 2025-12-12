import { useState } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useMidtrans } from '../hooks/useMidtrans';

interface CheckoutButtonProps {
    className?: string;
    onSuccess?: () => void;
}

export default function CheckoutButton({ className = '', onSuccess }: CheckoutButtonProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [email, setEmail] = useState('');
    const [showEmailModal, setShowEmailModal] = useState(false);

    // Load Midtrans configuration dynamically
    const { isLoaded: isMidtransLoaded, error: midtransError } = useMidtrans();

    // Backend API URL logic
    const getBackendUrl = () => {
        // 1. Check for explicit backend URL from environment
        if (import.meta.env.VITE_BACKEND_API_URL) return import.meta.env.VITE_BACKEND_API_URL;

        // 2. Production mode: always use Supabase Edge Functions
        if (import.meta.env.PROD) {
            // Use env var or fallback to hardcoded URL
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://viywfnjhpnunwhakhnrj.supabase.co';
            return `${supabaseUrl}/functions/v1`;
        }

        // 3. Development mode: detect if accessed from mobile/other device
        const currentHost = window.location.hostname;
        const isLocalhost = currentHost === 'localhost' || currentHost === '127.0.0.1';

        if (isLocalhost) {
            // Accessed from same machine - use localhost
            return 'http://localhost:3000';
        } else {
            // Accessed from mobile/other device - use the same host IP
            // This assumes backend is running on the same machine as the Vite dev server
            return `http://${currentHost}:3000`;
        }
    };

    const BACKEND_BASE_URL = getBackendUrl();

    // Debug: log backend URL on component mount (only in dev or when debugging)
    console.log('🔧 CheckoutButton Config:', {
        isProd: import.meta.env.PROD,
        backendUrl: BACKEND_BASE_URL,
        hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
        hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
    });

    const handleCheckout = () => {
        setShowEmailModal(true);
    };

    const processPayment = async () => {
        if (!email || !email.includes('@')) {
            alert('❌ Email tidak valid! Masukkan email yang benar.');
            return;
        }

        // Check if online first
        if (!navigator.onLine) {
            alert('❌ Tidak ada koneksi internet.\n\nPeriksa koneksi internet Anda dan coba lagi.');
            return;
        }

        setIsProcessing(true);

        // Helper function for API call with retry
        const callPaymentAPI = async (retryCount: number = 0): Promise<any> => {
            // Debug: Log environment
            console.log('🔍 Payment Debug:', {
                backendUrl: BACKEND_BASE_URL,
                email: email,
                attempt: retryCount + 1
            });

            // Extended timeout (30 seconds) for slow connections
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            try {
                // Determine endpoint based on backend type
                const isSupabase = BACKEND_BASE_URL.includes('supabase.co');
                const endpoint = isSupabase ? '/midtrans-payment' : '/api/payment';
                const apiUrl = `${BACKEND_BASE_URL}${endpoint}`;
                console.log('📡 Calling API:', apiUrl);

                // Prepare headers
                const headers: HeadersInit = {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                };

                // Add Auth header for Supabase functions
                if (isSupabase) {
                    // Use env var or fallback to hardcoded anon key
                    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpeXdmbmpocG51bndoYWtobnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NzQzMDAsImV4cCI6MjA0ODQ1MDMwMH0.Lj2Z-v1JHnr1VZsFplDUlXECPIiZGwzyNPdnrWf-sYM';
                    headers['Authorization'] = `Bearer ${anonKey}`;
                }

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        email: email,
                        amount: 1000,
                        item_name: 'Mahir Arab Gundul - Lifetime Access'
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || errorData.error || 'Gagal membuat transaksi');
                }

                return await response.json();
            } catch (error: any) {
                clearTimeout(timeoutId);

                // Retry once on network errors
                if (retryCount < 1 && (error.name === 'AbortError' || error.message === 'Failed to fetch')) {
                    console.log('⚠️ Retrying payment API call...');
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
                    return callPaymentAPI(retryCount + 1);
                }

                throw error;
            }
        };

        try {
            const data = await callPaymentAPI();

            if (!data.snap_token) {
                throw new Error('Tidak mendapatkan token pembayaran');
            }

            // Save email for auto-login after payment
            localStorage.setItem('payment_email', email);
            localStorage.setItem('payment_completed', 'pending');

            // Close modal
            setShowEmailModal(false);

            // Check if Midtrans is loaded
            if (!isMidtransLoaded || !window.snap) {
                throw new Error('Midtrans belum siap. Silakan tunggu sebentar dan coba lagi.');
            }

            // Open Midtrans Snap
            window.snap.pay(data.snap_token, {
                onSuccess: function (result) {
                    console.log('✅ Payment success:', result);

                    // Update localStorage
                    localStorage.setItem('payment_completed', 'true');

                    // Manual webhook trigger as backup via backend
                    const isSupabase = BACKEND_BASE_URL.includes('supabase.co');
                    const webhookEndpoint = isSupabase ? '/midtrans-webhook' : '/api/webhook';

                    fetch(`${BACKEND_BASE_URL}${webhookEndpoint}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            order_id: result.order_id || data.order_id,
                            transaction_status: 'settlement',
                            fraud_status: 'accept',
                            customer_details: {
                                email: email,
                                first_name: email.split('@')[0]
                            }
                        })
                    }).catch(err => console.error('Webhook trigger error:', err));

                    // Show success message
                    alert(`✅ Pembayaran Berhasil!\n\n🎉 Selamat! Akun Anda telah diaktifkan.\n\n📧 Email: ${email}\n\nSilakan login untuk mengakses semua fitur premium.`);

                    // Redirect to member area
                    if (onSuccess) {
                        onSuccess();
                    } else {
                        window.location.href = '/app';
                    }
                },
                onPending: function (result) {
                    console.log('⏳ Payment pending:', result);
                    alert('⏳ Pembayaran Sedang Diproses\n\nSilakan selesaikan pembayaran Anda.\nCek email untuk status pembayaran.');
                    setIsProcessing(false);
                },
                onError: function (result) {
                    console.error('❌ Payment error:', result);
                    alert('❌ Pembayaran Gagal\n\nTerjadi kesalahan saat memproses pembayaran.\nSilakan coba lagi.');
                    setIsProcessing(false);
                },
                onClose: function () {
                    console.log('🔒 Payment popup closed');
                    setIsProcessing(false);
                }
            });

        } catch (error: any) {
            console.error('❌ Payment error details:', {
                name: error?.name,
                message: error?.message,
                stack: error?.stack,
                fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
            });

            // Better error messages for mobile
            let errorMessage = 'Terjadi kesalahan saat memproses pembayaran';
            let debugInfo = '';

            if (error.name === 'AbortError') {
                errorMessage = '⏱️ Koneksi timeout (>30 detik setelah 2x percobaan).\n\nCoba lagi dengan koneksi WiFi yang lebih stabil.';
                debugInfo = 'Timeout after 30 seconds (retried once)';
            } else if (error.message === 'Failed to fetch' || error.message.includes('fetch')) {
                errorMessage = '📡 Gagal terhubung ke server setelah 2x percobaan.\n\nPeriksa koneksi internet Anda atau coba gunakan WiFi.';
                debugInfo = `API: ${BACKEND_BASE_URL}/...`;
            } else if (error.message && error.message.includes('JWT')) {
                errorMessage = '🔑 Sesi expired. Silakan refresh halaman dan coba lagi.';
                debugInfo = 'JWT validation failed';
            } else if (error.message) {
                errorMessage = error.message;
                debugInfo = error.name || 'Unknown error';
            }

            console.log('🐛 Debug info:', debugInfo);
            alert(`❌ Terjadi Kesalahan\n\n${errorMessage}\n\nSilakan coba lagi atau hubungi admin.`);
            setIsProcessing(false);
        }
    };

    return (
        <>
            <button
                onClick={handleCheckout}
                disabled={isProcessing || !isMidtransLoaded || !!midtransError}
                className={`${className} ${(isProcessing || !isMidtransLoaded || midtransError) ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={midtransError || (!isMidtransLoaded ? 'Memuat sistem pembayaran...' : '')}
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Memproses...</span>
                    </>
                ) : !isMidtransLoaded ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Memuat Pembayaran...</span>
                    </>
                ) : midtransError ? (
                    <>
                        <span>❌ Error Pembayaran</span>
                    </>
                ) : (
                    <>
                        <ShoppingCart className="w-5 h-5" />
                        <span>Ambil Promo Sekarang</span>
                    </>
                )}
            </button>

            {/* Loading/Error indicator */}
            {!isMidtransLoaded && !midtransError && (
                <div className="text-xs text-blue-600 mt-2 text-center animate-pulse">
                    ⏳ Memuat sistem pembayaran... Mohon tunggu
                </div>
            )}

            {midtransError && (
                <div className="text-xs text-red-600 mt-2 text-center">
                    <div>⚠️ {midtransError}</div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-1 text-blue-600 underline hover:text-blue-800"
                    >
                        Tap untuk refresh
                    </button>
                </div>
            )}

            {/* Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
                        <button
                            onClick={() => {
                                setShowEmailModal(false);
                                setIsProcessing(false);
                            }}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingCart className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                Checkout
                            </h3>
                            <p className="text-slate-600">
                                Masukkan email untuk aktivasi akun
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !isProcessing) {
                                        processPayment();
                                    }
                                }}
                                placeholder="nama@example.com"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors bg-white text-slate-900 placeholder:text-slate-400"
                                autoFocus
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                Email ini akan digunakan untuk login ke aplikasi
                            </p>
                        </div>

                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-600">Total Pembayaran:</span>
                                <span className="text-2xl font-bold text-emerald-600">Rp 1.000</span>
                            </div>
                            <p className="text-xs text-slate-500">
                                ✅ Lifetime Access • No Monthly Fees
                            </p>
                        </div>

                        <button
                            onClick={processPayment}
                            disabled={isProcessing || !email}
                            className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>Lanjut ke Pembayaran</span>
                                </>
                            )}
                        </button>

                        <p className="text-center text-xs text-slate-500 mt-4">
                            Pembayaran aman via Midtrans
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
