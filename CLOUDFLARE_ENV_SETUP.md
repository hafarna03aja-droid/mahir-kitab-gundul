# Setup Environment Variables di Cloudflare Pages

## 🔑 Environment Variables yang Diperlukan

Aplikasi ini membutuhkan environment variables berikut untuk berfungsi dengan baik:

### 1. VITE_MAIA_API_KEY
- **Nilai:** `sk-RTfzBVMp744fN-WAdlQacg`
- **Deskripsi:** API key untuk Maiarouter (AI provider default)
- **Provider:** Maiarouter (https://api.maiarouter.ai)

### 2. VITE_GEMINI_API_KEY
- **Nilai:** `sk-RTfzBVMp744fN-WAdlQacg` (sama dengan Maia karena routing)
- **Deskripsi:** API key untuk Google Gemini (fallback provider)
- **Provider:** Google AI Studio

### 3. VITE_MIDTRANS_CLIENT_KEY
- **Nilai:** `SB-Mid-client-W4qSN0B-zyY2x_dN`
- **Deskripsi:** Midtrans Sandbox Client Key untuk payment gateway
- **Provider:** Midtrans Sandbox

### 4. VITE_SUPABASE_URL
- **Nilai:** `https://viywfnjhpnunwhakhnrj.supabase.co`
- **Deskripsi:** URL endpoint Supabase project
- **Provider:** Supabase

### 5. VITE_SUPABASE_ANON_KEY
- **Nilai:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpeXdmbmpocG51bndoYWtobnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxOTgzMTMsImV4cCI6MjA3OTc3NDMxM30._Zj2FGSI7BnZBt6mUvOoJMZXXcUXSLijjPjiNYrTjQo`
- **Deskripsi:** Supabase Anon Key untuk authentication
- **Provider:** Supabase

---

## 📝 Cara Set Environment Variables di Cloudflare Pages

### Via Cloudflare Dashboard (Recommended)

1. **Login ke Cloudflare Dashboard**
   - Buka: https://dash.cloudflare.com
   - Login dengan akun Anda

2. **Navigasi ke Pages Project**
   - Klik **Pages** di menu kiri
   - Pilih project: **mahir-kitab-gundul**

3. **Buka Settings**
   - Klik tab **Settings**
   - Scroll ke bagian **Environment variables**

4. **Add Variables (Production)**
   - Klik **Add variable**
   - Masukkan variable name dan value
   - Pilih environment: **Production**
   - Klik **Save**

5. **Ulangi untuk semua 5 variables**
   ```
   VITE_MAIA_API_KEY = sk-RTfzBVMp744fN-WAdlQacg
   VITE_GEMINI_API_KEY = sk-RTfzBVMp744fN-WAdlQacg
   VITE_MIDTRANS_CLIENT_KEY = SB-Mid-client-W4qSN0B-zyY2x_dN
   VITE_SUPABASE_URL = https://viywfnjhpnunwhakhnrj.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

6. **Redeploy Project**
   - Setelah save semua variables
   - Klik **Deployments** tab
   - Klik **...** (menu) pada deployment terbaru
   - Pilih **Retry deployment**
   - Atau push commit baru ke GitHub untuk trigger auto-deploy

---

## ✅ Verifikasi Environment Variables

Setelah set environment variables, test dengan:

1. **Buka aplikasi:** https://mahirarab.web.id/app/
2. **Login dengan akun yang sudah bayar**
3. **Coba gunakan fitur AI:**
   - Tab **Analisis** → Input teks Arab
   - Tab **Asisten AI** → Tanya pertanyaan
   - **Jika berhasil:** Tidak ada error "Invalid API key"
   - **Jika masih error:** Cek browser console (F12) untuk detail

---

## 🔧 Troubleshooting

### Error: "Invalid API key" setelah login

**Penyebab:**
- Environment variables belum terset di Cloudflare Pages
- Browser masih cache aplikasi versi lama

**Solusi:**
1. Pastikan semua 5 environment variables sudah diset di Cloudflare
2. Redeploy aplikasi di Cloudflare Pages
3. Hard refresh browser: **Ctrl + Shift + R** (Windows) atau **Cmd + Shift + R** (Mac)
4. Clear browser cache dan cookies untuk domain mahirarab.web.id
5. Buka aplikasi di incognito/private mode untuk test

### Error: "API Key belum tersedia"

**Penyebab:**
- Environment variables tidak ter-inject saat build
- Nama variable salah (typo)

**Solusi:**
1. Cek nama variable harus **persis** seperti di atas (case-sensitive)
2. Pastikan prefix `VITE_` ada di semua variable
3. Redeploy setelah set variables

### Build berhasil tapi aplikasi masih error

**Penyebab:**
- Browser cache atau ServiceWorker lama

**Solusi:**
1. Buka DevTools (F12)
2. Tab **Application** → **Clear storage**
3. Centang semua → **Clear site data**
4. Hard refresh: **Ctrl + Shift + R**

---

## 📚 Referensi

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages/configuration/build-configuration/
- **Vite Environment Variables:** https://vitejs.dev/guide/env-and-mode.html
- **Supabase Dashboard:** https://supabase.com/dashboard/project/viywfnjhpnunwhakhnrj
- **Midtrans Dashboard:** https://dashboard.sandbox.midtrans.com

---

**Last Updated:** December 4, 2025
