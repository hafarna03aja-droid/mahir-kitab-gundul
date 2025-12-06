# Cloudflare Pages Configuration

This directory contains configuration files for deploying the application to Cloudflare Pages.

## 📁 Files Overview

### 1. `cloudflare-config.json`
**Purpose:** Dokumentasi konfigurasi Cloudflare Pages dalam format JSON

**Content:**
- Build settings (command, output directory)
- Environment variables (production & preview)
- Custom domain configuration
- Functions/Workers settings
- Deployment notes

**Note:** File ini adalah **dokumentasi reference**, bukan file konfigurasi yang dibaca oleh Cloudflare. Cloudflare Pages menggunakan dashboard UI untuk konfigurasi.

### 2. `wrangler.toml`
**Purpose:** Konfigurasi untuk Cloudflare Workers/Pages CLI (Wrangler)

**Usage:**
```bash
# Deploy via CLI (optional)
npm install -g wrangler
wrangler pages deploy dist --project-name mahir-arab-gundul
```

**Note:** Auto-deploy via GitHub sudah aktif, jadi wrangler CLI opsional.

### 3. `_worker.js`
**Purpose:** Cloudflare Pages Functions (routing logic)

**Content:**
- Handle `/app` routes untuk SPA
- Serve correct HTML files
- Asset passthrough

---

## 🚀 Deployment Methods

### Method 1: Auto Deploy (Recommended) ✅
**Setup:** Already configured!

1. Push to `main` branch
2. Cloudflare automatically builds and deploys
3. Live in 2-3 minutes

```bash
git add .
git commit -m "Your changes"
git push origin main
```

### Method 2: Manual Deploy via Wrangler CLI
**Setup:** Requires wrangler installation

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build locally
npm run build

# Deploy
wrangler pages deploy dist --project-name mahir-arab-gundul
```

---

## ⚙️ Environment Variables Setup

### Via Cloudflare Dashboard (Recommended)

1. Go to: https://dash.cloudflare.com
2. Navigate: **Pages** → **mahir-arab-gundul** → **Settings** → **Environment variables**
3. Add these variables:

```env
VITE_SUPABASE_URL=https://viywfnjhpnunwhakhnrj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci... (full key)
VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx
```

**Optional (for admin fallback):**
```env
VITE_GEMINI_API_KEY=AIzaSy... (optional)
VITE_MAIA_API_KEY=sk-... (optional)
```

4. Click **Save** and **Redeploy**

### Via Wrangler CLI (Alternative)

```bash
# Set secrets (for sensitive data)
wrangler pages secret put VITE_SUPABASE_ANON_KEY

# Or use .dev.vars for local development
# (NOT committed to git)
```

---

## 🔧 Build Configuration

### Current Settings

```json
{
  "build": {
    "command": "npm run build",
    "destination": "dist",
    "root_dir": "/"
  }
}
```

### Build Process

1. **TypeScript compilation:** `tsc`
2. **Vite build:** `vite build` (outputs to `dist/`)
3. **Environment injection:** `node scripts/inject-env.js`
4. **Copy worker:** `_worker.js` to `dist/_worker.js`

---

## 🌐 Custom Domain

**Current Domain:** `mahirarab.web.id`

**Setup Steps:**
1. Add custom domain in Cloudflare Pages settings
2. Configure DNS (CNAME or A record)
3. Wait for SSL certificate provisioning (~15 min)

**DNS Configuration:**
```
Type: CNAME
Name: @ (or mahirarab)
Value: mahir-arab-gundul.pages.dev
Proxy: Enabled (orange cloud)
```

---

## 📊 Deployment Status

**Production Branch:** `main`  
**Auto Deploy:** ✅ Enabled  
**Preview Branches:** `dev`, `preview/*`

**View Deployments:**
- Dashboard: https://dash.cloudflare.com/pages/mahir-arab-gundul/deployments
- Production: https://mahirarab.web.id
- Preview: https://<branch>.mahir-arab-gundul.pages.dev

---

## 🐛 Troubleshooting

### Build Fails
**Check:**
1. TypeScript errors: `npm run build` locally
2. Missing dependencies: `npm install`
3. Environment variables set in Cloudflare

### Environment Variables Not Working
**Solution:**
1. Verify variables in Cloudflare dashboard
2. Redeploy after adding variables
3. Hard refresh browser: `Ctrl + Shift + R`

### Custom Domain Not Working
**Check:**
1. DNS propagation (24-48 hours max)
2. SSL certificate status
3. Cloudflare proxy enabled (orange cloud)

---

## 📚 Additional Resources

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages
- **Wrangler Docs:** https://developers.cloudflare.com/workers/wrangler
- **Environment Variables Guide:** See `CLOUDFLARE_ENV_SETUP.md`
- **Deployment Guide:** See `DEPLOYMENT_CLOUDFLARE.md`

---

## 🔐 Security Notes

**DO NOT commit:**
- `.env` files (contains secrets)
- `.wrangler/` directory (local cache)
- Actual API keys in code

**Safe to commit:**
- `cloudflare-config.json` (documentation only)
- `wrangler.toml` (no secrets)
- `_worker.js` (routing logic)
- `.gitignore` (security rules)

---

## ✅ Checklist

- [x] Cloudflare Pages project created
- [x] GitHub repository connected
- [x] Auto-deploy configured
- [x] Environment variables set
- [x] Custom domain configured
- [x] SSL certificate active
- [x] Build optimization done
- [x] Production deployment successful

---

**Last Updated:** December 6, 2025
