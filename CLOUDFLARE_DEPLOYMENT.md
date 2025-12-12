# Panduan Deployment Cloudflare Pages

Panduan lengkap untuk deployment dan konfigurasi Cloudflare Pages untuk Mahir Arab.

---

## 🚀 Quick Deploy

```powershell
# Build dan deploy sekaligus
npm run deploy:cloudflare

# Atau manual:
npm run build:cloudflare
wrangler pages deploy dist --project-name mahir-kitab-gundul
```

**URL Production:** https://mahirarab.web.id

---

## 🔑 Environment Variables

Set di **Cloudflare Dashboard → Pages → Settings → Environment variables**:

| Variable | Deskripsi |
|----------|-----------|
| `VITE_MAIA_API_KEY` | API key Maiarouter |
| `VITE_GEMINI_API_KEY` | API key Google Gemini |
| `VITE_MIDTRANS_CLIENT_KEY` | Midtrans Client Key |
| `VITE_SUPABASE_URL` | URL Supabase project |
| `VITE_SUPABASE_ANON_KEY` | Supabase Anon Key |

### Cara Set:
1. Login ke [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Pages** → **mahir-kitab-gundul** → **Settings**
3. Scroll ke **Environment variables**
4. Add variable → Pilih **Production** → Save
5. **Redeploy** setelah set semua variables

---

## 🔗 Git Integration

### Connect GitHub:
1. Cloudflare Dashboard → Pages → mahir-kitab-gundul
2. Settings → **Builds & deployments** → Connect to Git
3. Authorize GitHub → Pilih repository
4. Branch: `main`

### Build Configuration:
```
Build command:       npm run build:cloudflare
Build output dir:    dist
Root directory:      /
```

### Automatic Deployments:
- ✅ `git push` ke `main` → auto deploy
- ✅ Preview deployments untuk branch lain
- ✅ Build logs di Dashboard

---

## 🏗️ Arsitektur Multi-Page App

```
dist/
├── _worker.js          # Cloudflare Worker routing
├── app/
│   └── index.html      # Member application (SPA)
├── assets/             # CSS, JS bundles
├── index.html          # Landing page
└── _redirects          # Fallback routing
```

### Routing:
- `/` → Landing Page
- `/app/*` → Member App (SPA routing via `_worker.js`)

---

## 🛠️ Troubleshooting

### "Invalid API key" setelah login
1. Pastikan semua env variables sudah diset
2. Redeploy aplikasi
3. Hard refresh: **Ctrl + Shift + R**
4. Clear browser cache

### 404 di /app/ routes
```powershell
npm run build:cloudflare
ls dist/_worker.js  # Pastikan file ada
```

### Static assets tidak load
Worker sudah handle pass-through untuk `.js`, `.css`, `.svg`, `.png`

---

## 📊 Monitoring

- **Build Logs:** Dashboard → Pages → Deployments
- **Runtime Errors:** Dashboard → Workers & Pages → Logs

---

**Last Updated:** December 2025
