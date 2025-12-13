import { useState } from 'react';
import { BookOpen, Sparkles, Rocket, Bot, Zap, Check, ChevronDown, XCircle, Menu, X, MessageCircle } from 'lucide-react';
import CheckoutButton from '../components/CheckoutButton';

export default function LandingPage() {
    const [openFaq, setOpenFaq] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-white font-sans antialiased">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900">Mahir Arab Gundul</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-6">
                            <button onClick={() => scrollToSection('features')} className="text-slate-600 hover:text-emerald-600 transition-colors">
                                Fitur
                            </button>
                            <button onClick={() => scrollToSection('pricing')} className="text-slate-600 hover:text-emerald-600 transition-colors">
                                Harga
                            </button>
                            <button onClick={() => scrollToSection('faq')} className="text-slate-600 hover:text-emerald-600 transition-colors">
                                FAQ
                            </button>
                            <a href="/app" className="px-4 py-2 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-lg font-semibold transition-colors">
                                Login Member
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-slate-600"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-slate-200">
                            <div className="flex flex-col gap-4">
                                <button onClick={() => scrollToSection('features')} className="text-slate-600 text-left">
                                    Fitur
                                </button>
                                <button onClick={() => scrollToSection('pricing')} className="text-slate-600 text-left">
                                    Harga
                                </button>
                                <button onClick={() => scrollToSection('faq')} className="text-slate-600 text-left">
                                    FAQ
                                </button>
                                <a href="/app" className="px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg font-semibold text-center">
                                    Login Member
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-emerald-50 via-white to-amber-50 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,191,36,0.1),transparent_50%)]" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span>Powered by AI Technology</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                            Baca Kitab Gundul Kini{' '}
                            <span className="text-emerald-600">Semudah Membaca Koran</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
                            Platform <span className="font-bold text-emerald-600">#1</span> Berbasis AI yang Memberikan{' '}
                            <span className="font-semibold">Harakat, Terjemahan, dan Analisis I'rab</span>{' '}
                            (Nahwu-Sharaf) Secara Otomatis dalam Hitungan Detik.
                        </p>

                        <CheckoutButton
                            className="group px-8 py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-3"
                            onSuccess={() => window.location.href = '/app'}
                        />

                        <p className="mt-4 text-sm text-slate-500">
                            🔒 Tanpa Langganan Bulanan • <span className="font-semibold text-emerald-600">1x Bayar untuk Selamanya</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Problem Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Apakah Anda Sering Mengalami Ini?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {[
                            { title: 'Pusing Menebak Harakat', desc: 'Masih sering ragu cara membunyikan huruf dan tanda baca dengan benar.' },
                            { title: 'Pusing Tata Bahasa', desc: 'Merasa aturan perubahan kata terlalu rumit dan sulit dihafal' },
                            { title: 'Sulit Paham Arti', desc: 'Lelah buka kamus satu per satu, tapi kalimatnya tetap sulit dimengerti.' },
                            { title: 'Belajar Tanpa Arah', desc: 'Bingung harus mulai dari mana dan tidak ada tempat bertanya saat kesulitan.' }
                        ].map((problem, i) => (
                            <div key={i} className="flex gap-4 p-6 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-red-300 transition-all">
                                <XCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{problem.title}</h3>
                                    <p className="text-slate-600">{problem.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-xl text-slate-700 font-semibold">
                            Jika Anda mengangguk, maka teknologi ini{' '}
                            <span className="text-emerald-600">dibuat khusus untuk Anda.</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Solution Section with CSS Mockup */}
            <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* CSS Mockup Chat UI */}
                        <div className="order-2 lg:order-1">
                            <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl shadow-2xl p-6 border-4 border-emerald-400">
                                {/* Chat Header */}
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-4 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                        <Bot className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">AI Assistant</p>
                                        <p className="text-emerald-100 text-xs">Online 24 jam</p>
                                    </div>
                                </div>

                                {/* User Message */}
                                <div className="flex justify-end mb-3">
                                    <div className="bg-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] shadow-lg">
                                        <p className="text-slate-800 text-sm">ما هو الفاعل؟</p>
                                    </div>
                                </div>

                                {/* AI Response */}
                                <div className="flex justify-start mb-3">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                                        <p className="text-white text-sm leading-relaxed">
                                            <span className="font-bold">Fa'il (الفاعل)</span> adalah kata yang menunjukkan
                                            pelaku dari suatu perbuatan. Contoh: <span className="font-arabic">كَتَبَ الطَّالِبُ</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Typing Indicator */}
                                <div className="flex justify-start">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 flex gap-1">
                                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="order-1 lg:order-2">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                Memperkenalkan:{' '}
                                <span className="text-emerald-600">MAHIR ARAB GUNDUL</span>
                            </h2>

                            <p className="text-2xl font-semibold text-slate-700 mb-4">
                                Asisten Pribadi Anda Untuk Baca Kitab Semudah Baca Koran
                            </p>

                            <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                Bukan sekadar kamus digital. Ini adalah{' '}
                                <span className="font-bold text-emerald-600">Revolusi Cara Belajar</span>.
                                Mahir Arab menggabungkan kekayaan literatur Islam klasik dengan AI tercanggih.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white scroll-mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Fitur-Fitur Canggih Yang Memudahkan Belajar Dari Nol
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                icon: Rocket,
                                title: 'Analisis I\'rab Otomatis',
                                desc: 'Copy-paste teks gundul apapun, AI akan langsung memberikan harakat lengkap beserta penjelasan gramatikal (Nahwu/Sharaf) per kata.',
                                gradient: 'from-emerald-500 to-teal-500'
                            },
                            {
                                icon: BookOpen,
                                title: 'Kitab Kuning Digital Interaktif',
                                desc: 'Akses kitab populer (Jurumiyah, Alfiyyah, dll) dengan fitur Click-to-Understand langsung di aplikasi.',
                                gradient: 'from-blue-500 to-indigo-500'
                            },
                            {
                                icon: Bot,
                                title: 'Asisten AI Pribadi 24 jam',
                                desc: 'Chatbot pintar siap menjawab pertanyaan seperti "Jelaskan perbedaan Jumlah Ismiyyah dan Fi\'liyyah!"',
                                gradient: 'from-purple-500 to-pink-500'
                            },
                            {
                                icon: Zap,
                                title: 'Smart Caching Technology',
                                desc: 'Teknologi database pintar yang membuat pencarian analisis kalimat umum menjadi super cepat.',
                                gradient: 'from-amber-500 to-orange-500'
                            }
                        ].map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <div key={i} className="group bg-slate-50 rounded-2xl p-8 border-2 border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all">
                                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 bg-gradient-to-br from-slate-50 to-white scroll-mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
                            <Sparkles className="w-4 h-4" />
                            <span>Penawaran Terbatas</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Investasi Terbaik Belajar Kitab Dari Nol
                        </h2>
                        <p className="text-xl text-slate-600">
                            Lupakan biaya les privat jutaan rupiah
                        </p>
                    </div>

                    <div className="max-w-lg mx-auto">
                        <div className="relative bg-white rounded-3xl border-4 border-amber-400 shadow-2xl p-8 hover:scale-105 transition-transform">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                                🔥 PALING POPULER
                            </div>

                            <div className="text-center mb-6 mt-4">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">MAHIR ARAB PRO</h3>
                                <p className="text-amber-600 font-semibold text-lg">(LIFETIME ACCESS)</p>
                            </div>

                            <div className="text-center mb-8">
                                <div className="flex items-center justify-center gap-3 mb-2">
                                    <span className="text-2xl text-slate-400 line-through">Rp 159.000</span>
                                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">-69%</span>
                                </div>
                                <div className="flex items-baseline justify-center gap-2">
                                    <span className="text-5xl md:text-6xl font-bold text-emerald-600">Rp 1.000</span>
                                </div>
                                <p className="text-slate-500 mt-2">Sekali bayar, akses selamanya ✨</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                {[
                                    'Akses Full Fitur AI (Analisis I\'rab, Terjemahan, Harakat)',
                                    'Akses Perpustakaan Kitab Digital Lengkap',
                                    'Smart Caching Technology (Pencarian Super Cepat)',
                                    'Free Update Selamanya',
                                    'BONUS: E-book Panduan Belajar Nahwu-Sharaf'
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                                            <Check className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <span className="text-slate-700 leading-relaxed">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <CheckoutButton
                                className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                                onSuccess={() => window.location.href = '/app'}
                            />

                            <div className="text-center mt-4">
                                <p className="text-sm text-slate-500 mb-2">✅ Pembayaran Aman via Midtrans</p>
                                <p className="text-xs text-slate-400">Garansi 100% Uang Kembali dalam 7 hari</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            💡 <span className="font-semibold">Hemat hingga 97%</span> dibanding biaya les privat
                            (Rp 200.000/pertemuan × 20x = Rp 4 juta)
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-20 bg-white scroll-mt-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Jawaban untuk Keraguanmu Memulai Baca Kitab

                        </h2>
                    </div>

                    <div className="space-y-6">
                        {/* Category 1: Keraguan Soal Kemampuan Dasar */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-emerald-600">1. Keraguan Soal Kemampuan Dasar</h3>
                            {[
                                {
                                    q: 'Saya benar-benar nol (belum tahu Nahwu/Shorof sama sekali), apakah bisa ikut?',
                                    a: 'Justru aplikasi "Semudah Baca Koran" ini dirancang untuk Anda. Kami tidak memulai dari hafalan rumus yang rumit, tapi dari pola kalimat yang sering muncul.\n\nAnda akan dibimbing mengenali pola, bukan sekadar menghafal teori.'
                                },
                                {
                                    q: 'Apakah saya harus lancar bahasa Arab percakapan dulu?',
                                    a: 'Tidak perlu. Bahasa Arab untuk percakapan (Muhadatsah) berbeda dengan Bahasa Arab untuk membaca kitab (Qiroatul Kutub). Di sini kita fokus pada skill membaca dan memahami teks, jadi Anda tidak perlu pusing memikirkan cara ngobrol dalam bahasa Arab.'
                                }
                            ].map((faq, i) => (
                                <div key={`kemampuan-${i}`} className="bg-slate-50 rounded-xl border-2 border-slate-200 overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === `kemampuan-${i}` ? null : `kemampuan-${i}`)}
                                        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-100 transition-colors"
                                    >
                                        <span className="font-bold text-slate-900 pr-4">{faq.q}</span>
                                        <ChevronDown className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform ${openFaq === `kemampuan-${i}` ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openFaq === `kemampuan-${i}` && (
                                        <div className="px-6 pb-6 text-slate-600 leading-relaxed whitespace-pre-line">{faq.a}</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Category 2: Keraguan Soal Metode & Waktu */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-emerald-600">2. Keraguan Soal Metode & Waktu</h3>
                            {[
                                {
                                    q: 'Berapa lama sampai saya bisa baca kitab sendiri?',
                                    a: 'Setiap orang berbeda, namun dengan aplikasi ini, target kami adalah Anda sudah bisa mengenali struktur kalimat dasar dan membaca teks sederhana dalam waktu 1-3 bulan (tergantung intensitas belajar). Kuncinya adalah konsistensi, bukan kecepatan.'
                                },
                                {
                                    q: 'Saya orang sibuk, apakah belajarnya menyita waktu?',
                                    a: 'Anda bisa akses aplikasi kapan saja lewat HP di sela-sela istirahat kerja atau sebelum tidur.'
                                }
                            ].map((faq, i) => (
                                <div key={`metode-${i}`} className="bg-slate-50 rounded-xl border-2 border-slate-200 overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === `metode-${i}` ? null : `metode-${i}`)}
                                        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-100 transition-colors"
                                    >
                                        <span className="font-bold text-slate-900 pr-4">{faq.q}</span>
                                        <ChevronDown className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform ${openFaq === `metode-${i}` ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openFaq === `metode-${i}` && (
                                        <div className="px-6 pb-6 text-slate-600 leading-relaxed whitespace-pre-line">{faq.a}</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Category 3: Keraguan Soal Hasil & Dukungan */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-emerald-600">3. Keraguan Soal Hasil & Dukungan</h3>
                            {[
                                {
                                    q: 'Aplikasi "Semudah Baca Koran" itu maksudnya bagaimana?',
                                    a: 'Saat baca koran, kita tidak mengeja huruf satu per satu, tapi langsung menangkap makna kalimat. Aplikasi kami melatih mata Anda untuk melihat "pola kata" dan "kedudukan kata" secara otomatis, sehingga membaca kitab gundul terasa mengalir seperti membaca teks Indonesia.'
                                },
                                {
                                    q: 'Kalau saya bingung di tengah jalan, bisa tanya ke siapa?',
                                    a: 'Anda tidak belajar sendirian. Ada fitur AI Mentor yang siap menjawab pertanyaan tata bahasa Anda 24 jam, serta grup komunitas di mana Anda bisa berdiskusi dengan sesama pembelajar dan instruktur.'
                                },
                                {
                                    q: 'Apakah ada jaminan saya pasti bisa?',
                                    a: 'Kami menjamin aplikasinya terstruktur dan mudah dicerna. Hasil akhir bergantung pada praktek Anda.'
                                }
                            ].map((faq, i) => (
                                <div key={`hasil-${i}`} className="bg-slate-50 rounded-xl border-2 border-slate-200 overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === `hasil-${i}` ? null : `hasil-${i}`)}
                                        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-100 transition-colors"
                                    >
                                        <span className="font-bold text-slate-900 pr-4">{faq.q}</span>
                                        <ChevronDown className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform ${openFaq === `hasil-${i}` ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openFaq === `hasil-${i}` && (
                                        <div className="px-6 pb-6 text-slate-600 leading-relaxed whitespace-pre-line">{faq.a}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
            </section>

            {/* Footer */}
            <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 pb-12 border-b border-slate-700">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                            Belum bisa bahasa Arab? Mulai dari sini.
                        </h3>
                        <p className="text-slate-300 text-lg mb-6">
                            Bergabunglah dengan ribuan penuntut ilmu lainnya
                        </p>
                        <CheckoutButton
                            className="px-8 py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-3"
                            onSuccess={() => window.location.href = '/app'}
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <h4 className="font-bold text-lg mb-4">Mahir Arab Gundul</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Platform pembelajaran Bahasa Arab berbasis AI untuk literatur Islam klasik.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li><a href="/app" className="hover:text-white transition-colors">Login Member</a></li>
                                <li><a href="/app/terms" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
                                <li><a href="/app/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">Hubungi Kami</h4>
                            <div className="space-y-3 text-slate-400 text-sm">
                                <div className="flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4" />
                                    <a
                                        href="https://wa.me/6287844528626?text=Halo%20admin%20saya%20ingin%20tanya%20tentang%20Mahir%20Arab"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-white transition-colors"
                                    >
                                        WhatsApp Admin
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center pt-8 border-t border-slate-700">
                        <p className="text-slate-400 text-sm">
                            © 2025 Mahir Arab Gundul • Dibuat dengan ❤️ untuk Umat
                        </p>
                        <p className="text-slate-500 text-xs mt-2">
                            Powered by 24 Learning Centre
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
