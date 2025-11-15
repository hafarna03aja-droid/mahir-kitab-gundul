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
git clone https://github.com/YOUR_USERNAME/mahir-arab-gundul.git
cd mahir-arab-gundul

# Install dependencies
npm install

# Setup environment (.env)
cp .env.example .env

# Start development
npm run dev
```

## 🔑 Environment Variables

```env
VITE_GEMINI_API_KEY=your_maiarouter_api_key
VITE_MAIAROUTER_URL=https://api.maiarouter.ai/v1/chat/completions
VITE_GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key
```

**API Keys:**
- Maiarouter: [Dashboard](https://maiarouter.ai)
- Google Gemini: [AI Studio](https://aistudio.google.com/apikey)

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/mahir-arab-gundul)

1. Click button above atau:
   ```bash
   npm install -g vercel
   vercel
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
