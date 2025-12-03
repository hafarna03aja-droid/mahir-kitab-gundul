# Panduan Deployment Cloudflare Pages

## 📋 Ringkasan
Aplikasi Mahir Arab sudah dikonfigurasi untuk deployment otomatis ke Cloudflare Pages dengan dukungan Multi-Page App (MPA) dan routing yang benar.

## 🚀 Deployment Utama

**URL Production:** https://mahir-arab-gundul.pages.dev

### Cara Deploy Manual

```powershell
# Build dan deploy sekaligus
npm run deploy:cloudflare

# Atau manual step-by-step:
npm run build:cloudflare
wrangler pages deploy dist --project-name mahir-arab-gundul
```

## 🏗️ Arsitektur Multi-Page App

### Struktur Halaman
- **Landing Page:** `/` → `dist/index.html`
- **Aplikasi Member:** `/app/*` → `dist/app/index.html` (SPA routing)

### Komponen Kunci

#### 1. **Vite Configuration** (`vite.config.ts`)
```typescript
build: {
  rollupOptions: {
    input: {
      main: resolve(__dirname, 'index.html'),      // Landing
      app: resolve(__dirname, 'app/index.html'),   // Member App
    }
  }
}
```

#### 2. **Cloudflare Worker** (`_worker.js`)
Custom Worker untuk handle routing Multi-Page App:
- Membiarkan static assets (.js, .css, dll) pass-through
- Redirect semua `/app` dan `/app/*` routes ke `app/index.html` untuk SPA
- Landing page tetap di root

#### 3. **Build Script** (`package.json`)
```json
{
  "build:cloudflare": "tsc && vite build && copy _worker.js dist\\_worker.js",
  "deploy:cloudflare": "npm run build:cloudflare && wrangler pages deploy dist --project-name mahir-arab-gundul"
}
```

Script ini:
1. Compile TypeScript
2. Build dengan Vite
3. Copy `_worker.js` ke `dist/_worker.js` untuk Cloudflare Workers

## 🔧 Konfigurasi Cloudflare

### Environment Variables
Set di Cloudflare Dashboard → Pages → Settings → Environment variables:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_MAIAROUTER_URL=https://api.maiarouter.ai/v1/chat/completions
VITE_MIDTRANS_CLIENT_KEY=your_midtrans_client_key_here
```

**Supabase Secrets** (set via `npx supabase secrets set`):
```
MIDTRANS_SERVER_KEY=your_midtrans_server_key_here
```

### wrangler.toml
```toml
name = "mahir-arab-gundul"
compatibility_date = "2024-01-01"
pages_build_output_dir = "dist"
```

## 📂 Struktur Deployment

```
dist/
├── _worker.js             # Cloudflare Worker untuk routing
├── app/
│   └── index.html         # Member application
├── assets/
│   ├── app-*.css
│   └── app-*.js
├── index.html             # Landing page
├── _redirects             # Fallback routing rules
└── vite.svg
```

## 🔐 Application Structure

### Landing Page (`/`)
- Terbuka untuk publik
- Midtrans payment integration
- Link ke member area

### Member App (`/app/`)
- Aplikasi React full-featured
- Fitur: Analisis teks, Kitab digital, AI Assistant, Live Tutor
- Routes publik: `/app/terms`, `/app/privacy`

## 🛠️ Troubleshooting

### Issue: 404 di /app/ routes
**Solusi:** Pastikan `_worker.js` ter-deploy dengan benar
```powershell
npm run build:cloudflare
# Cek apakah dist/_worker.js ada
ls dist/_worker.js
```

### Issue: Static assets tidak load
**Solusi:** Worker sudah allow pass-through untuk file extensions:
- `.js`, `.css`, `.svg`, `.png`, `.jpg`, dll.

### Issue: CORS errors
**Solusi:** Sudah ditangani di Supabase Edge Functions dengan proper CORS headers

## 📊 Monitoring

### Build Logs
Cek di Cloudflare Dashboard → Pages → Deployments

### Runtime Errors
Functions logs tersedia di Cloudflare Dashboard → Workers & Pages → mahir-arab-gundul → Logs

## 🔄 CI/CD Workflow

### Manual Deployment
```powershell
npm run deploy:cloudflare
```

### Future: Auto Deploy via GitHub Actions
Bisa setup Cloudflare Pages untuk auto-deploy setiap push ke `main`:
1. Di Cloudflare Dashboard → Pages → Settings
2. Connect ke GitHub repository
3. Set build command: `npm run build:cloudflare`
4. Set build output: `dist`

## 🌐 Domain Custom (Opsional)

Untuk set custom domain:
1. Cloudflare Dashboard → Pages → mahir-arab-gundul
2. Custom domains → Add custom domain
3. Follow DNS configuration steps

## 📝 Catatan Penting

1. **Always use `npm run build:cloudflare`** bukan `npm run build` biasa
2. Functions folder **harus** ada di `dist/functions/` saat deploy
3. Jangan edit `dist/` manual - selalu rebuild
4. Test lokal dengan `npm run preview` setelah build

## 🎯 Next Steps

- [ ] Setup auto-deploy via Cloudflare Pages + GitHub integration
- [ ] Add custom domain jika diperlukan
- [ ] Monitor performance via Cloudflare Analytics
- [ ] Setup alerts untuk deployment failures

---

**Deployment Terakhir:**
- Commit: `b8c17fa` - feat: add Cloudflare Pages Functions for Multi-Page App routing
- URL: https://0cb241fa.mahir-arab-gundul.pages.dev
- Status: ✅ Working correctly

**Tested:**
- ✅ Landing page loads at `/`
- ✅ Member app loads at `/app/`
- ✅ SPA routing works inside `/app/*`
- ✅ Static assets load correctly
- ✅ Midtrans payment integration working
