# Mahir Arab Gundul 📚

Platform pembelajaran Bahasa Arab berbasis AI dengan fitur analisis gramatikal lengkap, asisten AI, dan tutor audio interaktif.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-blue)

## ✨ Fitur Utama

### 🔍 Analisis Teks Arab
- **Analisis I'rab**: Tata bahasa Arab lengkap dengan terjemahan Indonesia
- **Analisis Sharaf**: Morfologi dan struktur kata  
- **Teks Bervokal**: Setiap kata dengan harakat lengkap
- **Balaghah**: Analisis retorika Arab
- **Export**: Markdown, TXT, dan DOC

### 📖 Kitab Digital
- **Alfiyyah Ibn Malik** - 8 bab Nahwu
- **Al-Ajurrumiyyah** - 12 bab dasar  
- **Nazham Al-Imriti** - 8 bab Sharaf
- **Qawaid al-Lughah** - 15 bab kaidah

### 🤖 Asisten AI
- Chat dengan AI expert Bahasa Arab
- Tanya jawab grammar & morfologi
- Riwayat percakapan tersimpan

### 🎙️ AI Audio Live
- Percakapan real-time dengan AI tutor
- Speech recognition Bahasa Arab
- Text-to-speech suara Arab Saudi
- Audio playback setiap pesan

### 🌓 Dark Mode Premium
- Theme switcher dengan animasi smooth
- Gradient design elegan

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/hafarna03aja-droid/mahir-kitab-gundul.git
cd mahir-kitab-gundul

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dan isi dengan API keys Anda (lihat SECURITY.md)
cp .env.example .env

# Start development
npm run dev
```

## 🔑 Environment Variables

Lihat `.env.example` untuk list lengkap. **Penting**: Jangan commit file `.env` ke Git!

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_MAIAROUTER_URL=https://api.maiarouter.ai/v1/chat/completions
VITE_MIDTRANS_CLIENT_KEY=your_midtrans_client_key_here
```

**Dapatkan API Keys:**
- Google Gemini: [AI Studio](https://aistudio.google.com/apikey)
- Maiarouter: [Dashboard](https://maiarouter.ai)
- Midtrans: [Dashboard](https://dashboard.midtrans.com)

**⚠️ Security**: Lihat [SECURITY.md](./SECURITY.md) untuk best practices.

## 🌐 Deploy to Cloudflare Pages

Deployment utama menggunakan Cloudflare Pages. Lihat [DEPLOYMENT_CLOUDFLARE.md](./DEPLOYMENT_CLOUDFLARE.md) untuk panduan lengkap.

```bash
# Build dan deploy
npm run deploy:cloudflare
```

2. Add Environment Variables di Vercel Dashboard

3. Deploy! 🚀

## 📁 Project Structure

```
src/
├── components/     # React components
├── contexts/       # Theme context
├── services/       # API services
├── data/          # Kitab data
└── types.ts       # TypeScript types
```

## 🛠️ Tech Stack

- React 18 + TypeScript
- Vite 5.4
- Tailwind CSS 3.4
- Lucide React
- Maiarouter API (Gemini)
- Web Speech API

## 📝 Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
```

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📧 Contact

24 Learning Centre • [mahirarab.com](https://mahirarab.com)

---

**"من سلك طريقا يلتمس فيه علما سهل الله له به طريقا إلى الجنة"**

Made with ❤️ for Arabic learners worldwide
