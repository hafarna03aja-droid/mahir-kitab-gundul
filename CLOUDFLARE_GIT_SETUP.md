# Cloudflare Pages Git Integration Setup

## 🔗 Connect GitHub to Cloudflare Pages

### Step 1: Connect Repository

1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Pilih account Anda
3. Klik **Pages** di sidebar kiri
4. Klik project **mahir-arab-gundul**
5. Settings → **Builds & deployments**
6. Klik **Connect to Git**

### Step 2: Authorize GitHub

1. Pilih **GitHub**
2. Authorize Cloudflare Pages access
3. Pilih repository: `hafarna03aja-droid/mahir-kitab-gundul`
4. Branch: `main`

### Step 3: Configure Build

**Build Configuration:**
```
Build command:       npm run build:cloudflare
Build output dir:    dist
Root directory:      /
```

**Environment Variables:**
Sudah diset via Dashboard → Settings → Environment variables ✅

### Step 4: Deploy

1. Klik **Save and Deploy**
2. Cloudflare akan otomatis build dan deploy
3. Environment variables akan otomatis digunakan

## 🚀 Automatic Deployments

Setelah setup Git integration:
- ✅ Setiap `git push` ke `main` → auto deploy
- ✅ Environment variables dari dashboard otomatis digunakan
- ✅ Build logs tersedia di Cloudflare Dashboard
- ✅ Preview deployments untuk branch lain

## 🔄 Manual Trigger

Jika perlu trigger manual:
1. Cloudflare Dashboard → Pages → mahir-arab-gundul
2. Deployments tab
3. Klik **Create deployment**
4. Pilih branch `main`
5. Deploy

## ✅ Verification

Setelah deployment dari Cloudflare:
1. Check deployment URL
2. Inspect page → Console
3. Cari script tag Midtrans dengan Client Key yang benar (bukan PLACEHOLDER)

---

**Keuntungan Git Integration:**
- 🔐 Environment variables aman (build di Cloudflare)
- 🤖 Auto deploy on push
- 📊 Build logs & analytics
- 🔄 Easy rollback
- 🌿 Preview deployments
