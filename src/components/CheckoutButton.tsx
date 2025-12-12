import { useState } from 'react';
import { ShoppingCart, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { useMidtrans } from '../hooks/useMidtrans';
import { supabase } from '../supabaseClient';

interface CheckoutButtonProps {
    className?: string;
    onSuccess?: () => void;
}

export default function CheckoutButton({ className = '', onSuccess }: CheckoutButtonProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [email, setEmail] = useState('');
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [signupLoading, setSignupLoading] = useState(false);
    const [signupMessage, setSignupMessage] = useState('');

    // Load Midtrans configuration dynamically
    const { isLoaded: isMidtransLoaded, error: midtransError } = useMidtrans();

    // Backend API URL logic
    const getBackendUrl = () => {
        // 1. Check for explicit backend URL from environment
        if (import.meta.env.VITE_BACKEND_API_URL) return import.meta.env.VITE_BACKEND_API_URL;

        // 2. Production mode: use Cloudflare Worker API (same domain)
        // This is more reliable than Supabase Edge Functions
        if (import.meta.env.PROD) {
            // Use the same origin - Cloudflare Worker handles /api/* routes
            return window.location.origin;
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
        origin: window.location.origin
    });

    const handleCheckout = () => {
        setShowEmailModal(true);
    };

    // Handle signup from success modal
    const handleSignup = async () => {
        if (!password || password.length < 6) {
            setSignupMessage('❌ Password minimal 6 karakter!');
            return;
        }

        setSignupLoading(true);
        setSignupMessage('');

        try {
            // Check if profile already exists (from payment)
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('status')
                .eq('email', email)
                .single();

            // Sign up user
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { email },
                    emailRedirectTo: window.location.origin + '/app'
                }
            });

            if (error) throw error;

            if (data.user) {
                // Link profile with user ID
                if (existingProfile) {
                    await supabase
                        .from('profiles')
                        .update({
                            id: data.user.id,
                            updated_at: new Date().toISOString()
                        })
                        .eq('email', email);
                }

                setSignupMessage('✅ Akun berhasil dibuat! Mengalihkan ke aplikasi...');

                // Redirect to app after short delay
                setTimeout(() => {
                    if (onSuccess) {
                        onSuccess();
                    } else {
                        window.location.href = '/app';
                    }
                }, 1500);
            }
        } catch (error: any) {
            if (error.message?.includes('already registered')) {
                setSignupMessage('⚠️ Email sudah terdaftar. Silakan login langsung.');
            } else {
                setSignupMessage('❌ Gagal membuat akun: ' + error.message);
            }
        } finally {
            setSignupLoading(false);
        }
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
                        amount: 100,
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

                    // Manual webhook with complete data for proper processing
                    fetch(`${BACKEND_BASE_URL}${webhookEndpoint}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            order_id: result.order_id || data.order_id,
                            transaction_status: 'settlement',
                            fraud_status: 'accept',
                            status_code: '200',
                            gross_amount: '100.00',
                            payment_type: result.payment_type || 'manual_trigger',
                            transaction_time: new Date().toISOString(),
                            customer_details: {
                                email: email,
                                first_name: email.split('@')[0]
                            }
                        })
                    })
                        .then(res => res.json())
                        .then(data => console.log('✅ Webhook response:', data))
                        .catch(err => console.error('❌ Webhook trigger error:', err));

                    // Show success modal instead of alert
                    setIsProcessing(false);
                    setShowSuccessModal(true);
                },
                onPending: function (result) {
                    console.log('⏳ Payment pending:', result);

                    // Update localStorage - payment initiated
                    localStorage.setItem('payment_completed', 'pending');
                    localStorage.setItem('payment_email', email);

                    // Trigger webhook anyway for pending - some payments complete later
                    const isSupabase = BACKEND_BASE_URL.includes('supabase.co');
                    const webhookEndpoint = isSupabase ? '/midtrans-webhook' : '/api/webhook';

                    fetch(`${BACKEND_BASE_URL}${webhookEndpoint}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            order_id: result.order_id || data.order_id,
                            transaction_status: result.transaction_status || 'pending',
                            fraud_status: result.fraud_status || 'accept',
                            status_code: result.status_code || '201',
                            gross_amount: '100.00',
                            payment_type: result.payment_type || 'pending_payment',
                            transaction_time: new Date().toISOString(),
                            customer_details: {
                                email: email,
                                first_name: email.split('@')[0]
                            }
                        })
                    }).catch(err => console.error('Webhook error:', err));

                    // Show success modal anyway - user can proceed to login/check status
                    setIsProcessing(false);
                    setShowSuccessModal(true);
                },
                onError: function (result) {
                    console.error('❌ Payment error:', result);
                    alert('❌ Pembayaran Gagal\n\nTerjadi kesalahan saat memproses pembayaran.\nSilakan coba lagi.');
                    setIsProcessing(false);
                },
                onClose: function () {
                    console.log('🔒 Payment popup closed');

                    // Check if payment was initiated (localStorage was set in onSuccess/onPending)
                    const paymentStatus = localStorage.getItem('payment_completed');

                    if (paymentStatus === 'true' || paymentStatus === 'pending') {
                        // Payment was processed, show success modal
                        setShowSuccessModal(true);
                    } else {
                        // User closed without completing payment
                        // Still show success modal with option to check status
                        // In case they completed payment but callback didn't fire properly
                        localStorage.setItem('payment_email', email);
                        setShowSuccessModal(true);
                    }

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
                                <span className="text-2xl font-bold text-emerald-600">Rp 100</span>
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

            {/* Payment Success Modal with Signup */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
                        {/* Success Icon */}
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
                            🎉 Pembayaran Berhasil!
                        </h2>

                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 text-center">
                            <p className="text-xs text-slate-500">Email:</p>
                            <p className="font-bold text-emerald-700">{email}</p>
                        </div>

                        {/* Signup Form */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
                            <h3 className="font-bold text-slate-800 mb-3 text-center">
                                📝 Buat Password untuk Login
                            </h3>

                            <div className="relative mb-3">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSignup()}
                                    placeholder="Buat password (min. 6 karakter)"
                                    className="w-full pl-10 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-slate-900"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            <button
                                onClick={handleSignup}
                                disabled={signupLoading || !password}
                                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {signupLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                        Buat Akun & Masuk
                                    </>
                                )}
                            </button>

                            {signupMessage && (
                                <p className={`mt-3 text-sm text-center ${signupMessage.includes('✅') ? 'text-emerald-600' :
                                    signupMessage.includes('⚠️') ? 'text-amber-600' : 'text-red-600'
                                    }`}>
                                    {signupMessage}
                                </p>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-4">
                            <div className="flex-1 border-t border-slate-200"></div>
                            <span className="text-xs text-slate-400">atau</span>
                            <div className="flex-1 border-t border-slate-200"></div>
                        </div>

                        {/* Alternative Actions */}
                        <div className="space-y-2">
                            <button
                                onClick={() => window.location.href = '/app'}
                                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm"
                            >
                                Sudah punya akun? Login
                            </button>
                        </div>

                        <p className="text-xs text-slate-400 mt-4 text-center">
                            Butuh bantuan? admin@mahirarab.web.id
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
