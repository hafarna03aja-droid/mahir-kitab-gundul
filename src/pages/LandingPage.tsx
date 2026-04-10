import { useState } from 'react';
import { BookOpen, Sparkles, Rocket, Bot, Zap, Check, ChevronDown, XCircle, Menu, X, MessageCircle, MessageSquare, Search, Mic, Send, ArrowLeft, Video, Phone, MoreVertical, Smile, Camera } from 'lucide-react';
import CheckoutButton from '../components/CheckoutButton';

export default function LandingPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
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
                            className="group px-6 py-3 sm:px-8 sm:py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-3"
                            onSuccess={() => window.location.href = '/app'}
                        />

                        <p className="mt-4 text-sm text-slate-500">
                            🔒 Akses Penuh Seluruh Fitur • <span className="font-semibold text-emerald-600">Investasi Terbaik Belajar Kitab</span>
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
                            <div key={i} className="flex gap-3 sm:gap-4 p-4 sm:p-6 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-red-300 transition-all">
                                <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 flex-shrink-0 mt-1" />
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
                        {/* Visual Fitur Cards - Fully Responsive */}
                        <div className="order-2 lg:order-1">
                            <div className="bg-white rounded-2xl shadow-2xl border-2 border-emerald-100 p-6">
                                {/* Header Badge */}
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md flex-shrink-0">
                                        <BookOpen className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Mahir Arab Gundul</p>
                                        <p className="text-xs text-emerald-600 font-medium">Platform Pembelajaran Bahasa Arab</p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-xs font-semibold text-emerald-700">AI Aktif</span>
                                    </div>
                                </div>

                                {/* Feature Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { icon: Search, label: 'Analisis I\'rab', desc: 'Harakat & I\'rab otomatis', color: 'from-orange-400 to-amber-500', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' },
                                        { icon: BookOpen, label: 'Kitab Digital', desc: 'Perpustakaan interaktif', color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
                                        { icon: MessageSquare, label: 'Asisten AI', desc: 'Tanya jawab 24 jam', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' },
                                        { icon: Mic, label: 'AI Audio', desc: 'Dengarkan pelafalan', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
                                    ].map((item, i) => {
                                        const Icon = item.icon;
                                        return (
                                            <div key={i} className={`${item.bg} border ${item.border} rounded-xl p-4 flex flex-col gap-2`}>
                                                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shadow-sm`}>
                                                    <Icon className="w-4 h-4 text-white" />
                                                </div>
                                                <p className={`text-sm font-bold ${item.text}`}>{item.label}</p>
                                                <p className="text-xs text-slate-500 leading-snug">{item.desc}</p>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Bottom Chat Bubble */}
                                <div className="mt-4 bg-slate-50 rounded-xl p-4 flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <MessageSquare className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex-1">
                                        <p className="text-slate-700 text-xs leading-relaxed">
                                            Assalamualaikum! Saya Asisten Cerdas Anda. Silakan tanyakan apa saja tentang kaidah Nahwu, Sharaf, atau Balaghah.
                                        </p>
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

                    {/* Second Feature Row: Analisis Teks */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center mt-24">
                        {/* Content */}
                        <div className="order-1">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                Analisis Teks <span className="text-emerald-600">Terpercaya</span>
                            </h2>

                            <p className="text-2xl font-semibold text-slate-700 mb-4">
                                Harakat, I'rab, dan Terjemahan dalam Satu Tampilan
                            </p>

                            <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                Tidak perlu lagi membolak-balik literatur tebal. Masukkan teks gundul apapun, dan biarkan teknologi AI kami menyusun analisis i'rab mendalam secara instan dari setiap kata, dilengkapi dengan terjemahan dan referensi teks-teks klasik.
                            </p>
                        </div>

                        {/* Visual Analisis Teks Card - Fully Responsive */}
                        <div className="order-2">
                            <div className="bg-white rounded-2xl shadow-2xl border-2 border-emerald-100 p-6">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-md flex-shrink-0">
                                        <Search className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Penganalisis Teks Arab</p>
                                        <p className="text-xs text-slate-500">Harakat • I'rab • Terjemahan</p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                                        <Zap className="w-3 h-3 text-amber-500" />
                                        <span className="text-xs font-semibold text-amber-700">Instan</span>
                                    </div>
                                </div>

                                {/* Arabic text input mockup */}
                                <div className="bg-slate-50 rounded-xl p-4 mb-4 text-right border border-slate-200">
                                    <p className="text-2xl font-arabic text-slate-800 leading-loose tracking-wide">
                                        بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
                                    </p>
                                </div>

                                {/* Word analysis results */}
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    {[
                                        { word: 'بِسْمِ', type: 'Isim', irab: 'Jar - Majrur', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                                        { word: 'اللهِ', type: 'Isim', irab: 'Mudhaf Ilaih', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
                                        { word: 'الرَّحْمٰنِ', type: 'Sifat', irab: 'Na\'at', color: 'bg-purple-50 border-purple-200 text-purple-700' },
                                        { word: 'الرَّحِيْمِ', type: 'Sifat', irab: 'Na\'at', color: 'bg-rose-50 border-rose-200 text-rose-700' },
                                    ].map((item, i) => (
                                        <div key={i} className={`${item.color} border rounded-lg p-3`}>
                                            <p className="text-lg font-bold text-slate-800 text-right mb-1">{item.word}</p>
                                            <div className="flex items-center gap-1 flex-wrap">
                                                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${item.color}`}>{item.type}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">{item.irab}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Translation result */}
                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2">
                                    <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-semibold text-emerald-700 mb-0.5">Terjemahan:</p>
                                        <p className="text-sm text-slate-700">Dengan nama Allah Yang Maha Pengasih, Maha Penyayang</p>
                                    </div>
                                </div>
                            </div>
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

            {/* Testimonial Section (WhatsApp UI Mockup) */}
            <section className="py-20 bg-slate-50 border-t border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <div className="order-1">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                Apa Kata Mereka Tentang <br/>
                                <span className="text-emerald-600">Mahir Arab Gundul?</span>
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                Mulai dari pemula yang baru belajar, santri, hingga pengajar bahasa Arab telah membuktikan kemudahan belajar via aplikasi kami. Berikut adalah salah satu ulasan nyata dari pengguna kami.
                            </p>
                        </div>
                        
                        {/* WhatsApp Mockup */}
                        <div className="order-2 flex justify-center">
                            <div className="bg-[#efeae2] rounded-3xl shadow-2xl overflow-hidden border-[6px] border-slate-800 w-full max-w-[380px] flex flex-col h-[600px] relative">
                                {/* WA Header */}
                                <div className="bg-[#075e54] text-white px-3 py-3 flex items-center justify-between shadow-sm z-10">
                                    <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden">
                                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer flex-shrink-0" />
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-indigo-900 rounded-full flex items-center justify-center font-bold text-white text-xs overflow-hidden flex-shrink-0">
                                            <span className="text-[8px] sm:text-[9px]">MAOS</span>
                                        </div>
                                        <div className="leading-tight cursor-pointer min-w-0">
                                            <div className="font-semibold text-[14px] sm:text-[15px] truncate">Ustaz Indra Kurnia</div>
                                            <div className="text-[11px] sm:text-[12px] text-white/90 truncate">online</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Video className="w-5 h-5 cursor-pointer" />
                                        <Phone className="w-5 h-5 fill-current cursor-pointer" />
                                        <MoreVertical className="w-5 h-5 cursor-pointer" />
                                    </div>
                                </div>

                                {/* WA Chat Area */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')] bg-repeat bg-[length:400px] hidden-scrollbar">
                                    
                                    {/* Msg 1 */}
                                    <div className="flex justify-start">
                                        <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 max-w-[88%] shadow-sm relative text-[14.5px] leading-snug text-[#111b21]">
                                            <div className="font-bold text-[#029688] text-[13px] mb-0.5">Ustaz Indra Kurnia</div>
                                            Assalamu'alaikum, tim 24 Learning Center. Saya sudah coba aplikasi Mahir Arab Gundul. Jujur, saya sangat terkesan. Saya sangat merekomendasikan aplikasi ini untuk pemula yang ingin serius belajar membaca Al-Qur'an.
                                            <div className="text-[10.5px] text-[#667781] text-right mt-1.5 -mb-0.5">10:05</div>
                                        </div>
                                    </div>

                                    {/* Msg 2 */}
                                    <div className="flex justify-end">
                                        <div className="bg-[#d9fdd3] rounded-lg rounded-tr-none px-3 py-2 max-w-[88%] shadow-sm relative text-[14.5px] leading-snug text-[#111b21]">
                                            <div className="font-bold text-[#1ca665] text-[13px] mb-0.5">Admin 24 Learning Center</div>
                                            Wa'alaikumussalam, Ustaz Indra. Alhamdulillah, sebuah kehormatan bagi kami. Bagian mana yang menurut Ustaz paling menonjol?
                                            <div className="text-[10.5px] text-[#667781] text-right mt-1.5 -mb-0.5 flex items-center justify-end gap-1">
                                                10:07
                                                <svg viewBox="0 0 16 11" width="16" height="11" className=""><path d="M11.832 2.115l-4.73 4.708-2.181-2.155L3.633 5.92l3.468 3.426 6.019-5.992-1.288-1.239z" fill="#53bdeb"></path><path d="M15.42 2.115l-4.73 4.708-1.636-1.616-1.288 1.24 2.924 2.887 6.018-5.99-1.288-1.239z" fill="#53bdeb"></path></svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Msg 3 */}
                                    <div className="flex justify-start">
                                        <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 max-w-[88%] shadow-sm relative text-[14.5px] leading-snug text-[#111b21]">
                                            Penyampaian materinya sangat sistematis dan ringkas. Fitur latihan i'rab-nya juga sangat membantu untuk menguji pemahaman secara langsung.
                                            <div className="my-2"></div>
                                            Saya sudah sampaikan ke beberapa kolega dan santri, kalau ini adalah aplikasi pendamping terbaik untuk belajar bahasa Arab secara mandiri saat ini. Pertahankan terus kinerjanya!
                                            <div className="text-[10.5px] text-[#667781] text-right mt-1.5 -mb-0.5">10:12</div>
                                        </div>
                                    </div>

                                    {/* Msg 4 */}
                                    <div className="flex justify-end">
                                        <div className="bg-[#d9fdd3] rounded-lg rounded-tr-none px-3 py-2 max-w-[88%] shadow-sm relative text-[14.5px] leading-snug text-[#111b21]">
                                            Masya Allah, terima kasih banyak atas apresiasi dan rekomendasinya, Ustaz. Ini suntikan semangat yang luar biasa untuk tim kami agar terus mengembangkan fitur-fitur baru.
                                            <div className="text-[10.5px] text-[#667781] text-right mt-1.5 -mb-0.5 flex items-center justify-end gap-1">
                                                10:15
                                                <svg viewBox="0 0 16 11" width="16" height="11" className=""><path d="M11.832 2.115l-4.73 4.708-2.181-2.155L3.633 5.92l3.468 3.426 6.019-5.992-1.288-1.239z" fill="#53bdeb"></path><path d="M15.42 2.115l-4.73 4.708-1.636-1.616-1.288 1.24 2.924 2.887 6.018-5.99-1.288-1.239z" fill="#53bdeb"></path></svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Msg 5 */}
                                    <div className="flex justify-start">
                                        <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 max-w-[88%] shadow-sm relative text-[14.5px] leading-snug text-[#111b21]">
                                            Waiyyakum. Semoga menjadi sarana dakwah yang luas. Sukses terus untuk 24 Learning Center. 👍
                                            <div className="text-[10.5px] text-[#667781] text-right mt-1.5 -mb-0.5">10:16</div>
                                        </div>
                                    </div>

                                    {/* Msg 6 */}
                                    <div className="flex justify-end">
                                        <div className="bg-[#d9fdd3] rounded-lg rounded-tr-none px-3 py-2 max-w-[88%] shadow-sm relative text-[14.5px] leading-snug text-[#111b21]">
                                            Amin. Terima kasih banyak, Ustaz! 🙏
                                            <div className="text-[10.5px] text-[#667781] text-right mt-1.5 -mb-0.5 flex items-center justify-end gap-1">
                                                10:17
                                                <svg viewBox="0 0 16 11" width="16" height="11" className=""><path d="M11.832 2.115l-4.73 4.708-2.181-2.155L3.633 5.92l3.468 3.426 6.019-5.992-1.288-1.239z" fill="#53bdeb"></path><path d="M15.42 2.115l-4.73 4.708-1.636-1.616-1.288 1.24 2.924 2.887 6.018-5.99-1.288-1.239z" fill="#53bdeb"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>

                                {/* WA Footer */}
                                <div className="bg-[#f0f2f5] px-2 py-2.5 flex items-center gap-1.5 sm:gap-2 z-10 w-full relative">
                                    <div className="flex-1 bg-white rounded-full flex items-center px-3 sm:px-4 py-2.5 gap-2 sm:gap-3 text-slate-500 shadow-sm overflow-hidden">
                                        <Smile className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 cursor-pointer text-slate-400" />
                                        <input type="text" placeholder="Tulis pesan" className="flex-1 bg-transparent outline-none text-[14px] sm:text-[16px] text-slate-700 placeholder:text-slate-500 min-w-0" disabled />
                                        <div className="flex items-center gap-2 sm:gap-4 text-slate-400">
                                            <Camera className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 cursor-pointer" />
                                            <Mic className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 cursor-pointer hidden sm:block" />
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00a884] rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-sm cursor-pointer shadow-md">
                                        <Send className="w-4 h-4 sm:w-5 sm:h-5 sm:ml-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
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
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 px-3 py-1.5 sm:px-6 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg whitespace-nowrap">
                                🔥 PALING POPULER
                            </div>

                            <div className="text-center mb-6 mt-4">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">MAHIR ARAB PRO</h3>
                            </div>

                            {/* Ramadan Promo Badge */}
                            <div className="relative mb-6 mx-auto max-w-md">
                                <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl p-0.5 shadow-lg animate-pulse">
                                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl px-6 py-4">
                                        <div className="flex items-center justify-center gap-3 mb-2">
                                            <span className="text-3xl">🌙</span>
                                            <h4 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                                PROMO RAMADHAN
                                            </h4>
                                            <span className="text-3xl">✨</span>
                                        </div>
                                        <p className="text-center text-emerald-700 font-bold text-sm md:text-base">
                                            Berkah Berlimpah, Harga Istimewa!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mb-8">
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    <span className="text-2xl text-slate-400 line-through">Rp 159.000</span>
                                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
                                        HEMAT 69%
                                    </span>
                                </div>
                                <div className="relative inline-block">
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 blur-xl opacity-30 animate-pulse"></div>
                                    <div className="relative flex items-baseline justify-center gap-2 bg-gradient-to-br from-emerald-50 to-teal-50 px-8 py-4 rounded-2xl border-2 border-emerald-200">
                                        <span className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                            Rp 49.000
                                        </span>
                                    </div>
                                </div>
                                <p className="text-slate-500 mt-3 font-semibold">Dapatkan akses penuh sekarang juga ✨</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                {[
                                    'Akses Full Fitur AI (Analisis I\'rab, Terjemahan, Harakat)',
                                    'Akses Perpustakaan Kitab Digital Lengkap',
                                    'Smart Caching Technology (Pencarian Super Cepat)',
                                    'Update Fitur Berkala',
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
                                className="w-full py-3 sm:py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 sm:gap-3"
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

                    <div className="space-y-4">
                        {[
                            {
                                q: 'Saya benar-benar nol (belum tahu Nahwu/Shorof sama sekali), apakah bisa ikut?',
                                a: 'Justru aplikasi "Semudah Baca Koran" ini dirancang untuk Anda. Kami tidak memulai dari hafalan rumus yang rumit, tapi dari pola kalimat yang sering muncul.'
                            },
                            {
                                q: 'Apakah saya harus lancar bahasa Arab percakapan dulu?',
                                a: 'Tidak perlu. Bahasa Arab untuk percakapan (Muhadatsah) berbeda dengan Bahasa Arab untuk membaca kitab (Qiroatul Kutub). Di sini kita fokus pada skill membaca dan memahami teks, jadi Anda tidak perlu pusing memikirkan cara ngobrol dalam bahasa Arab.'
                            },
                            {
                                q: 'Berapa lama sampai saya bisa baca kitab sendiri?',
                                a: 'Setiap orang berbeda, namun dengan aplikasi ini, target kami adalah Anda sudah bisa mengenali struktur kalimat dasar dan membaca teks sederhana dalam waktu 1-3 bulan (tergantung intensitas belajar). Kuncinya adalah konsistensi, bukan kecepatan.'
                            },
                            {
                                q: 'Saya orang sibuk, apakah belajarnya menyita waktu?',
                                a: 'Anda bisa akses aplikasi kapan saja lewat HP di sela-sela istirahat kerja atau sebelum tidur.'
                            },
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
                            <div key={i} className="bg-slate-50 rounded-xl border-2 border-slate-200 overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-100 transition-colors"
                                >
                                    <span className="font-bold text-slate-900 pr-4">{faq.q}</span>
                                    <ChevronDown className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-6 text-slate-600 leading-relaxed">{faq.a}</div>
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
                            className="px-6 py-3 sm:px-8 sm:py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-3"
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
