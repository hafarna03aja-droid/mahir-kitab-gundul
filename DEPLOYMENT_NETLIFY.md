# Panduan Deploy ke Netlify

## 📝 Persiapan

### 1. Pastikan Git terinstall
```bash
git --version
```

### 2. Push Kode ke GitHub
Pastikan kode Anda sudah ada di repository GitHub. Jika belum:

```bash
# Inisialisasi Git
git init
git add .
git commit -m "Siap deploy ke Netlify"

# Hubungkan ke GitHub (ganti URL dengan repository Anda)
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## 🚀 Deploy ke Netlify

### Opsi 1: Via Netlify Dashboard (Recommended)

1. **Login ke Netlify**
   - Kunjungi [netlify.com](https://www.netlify.com/)
   - Login atau Sign up (bisa menggunakan GitHub account)

2. **Import Repository**
   - Klik tombol **"Add new site"** -> **"Import an existing project"**
   - Pilih **GitHub**
   - Authorize Netlify jika diminta
   - Cari dan pilih repository `mahir-arab-gundul` (atau nama repo Anda)

3. **Configure Build Settings**
   Netlify biasanya akan mendeteksi setting secara otomatis karena adanya file `netlify.toml` atau mendeteksi Vite.
   Pastikan settingnya sebagai berikut:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

4. **Environment Variables**
   Klik tombol **"Add environment variables"** (atau bisa diatur nanti di Site Settings).
   Tambahkan variable yang diperlukan sesuai file `.env` Anda (JANGAN copy paste seluruh file .env, masukkan key dan value nya):

   | Key | Value |
   |-----|-------|
   | `VITE_GEMINI_API_KEY` | (API Key Anda) |
   | `VITE_MAIAROUTER_URL` | `https://api.maiarouter.ai/v1/chat/completions` |
   | `VITE_GOOGLE_GEMINI_API_KEY` | (Optional, jika pakai Google AI Studio) |

5. **Deploy**
   - Klik **"Deploy mahir-arab-gundul"**
   - Tunggu proses build selesai (biasanya 1-2 menit)

### Opsi 2: Via Netlify CLI (Manual Deploy)

Jika Anda ingin deploy langsung dari terminal tanpa push ke GitHub dulu (untuk testing):

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   # Build project dulu
   npm run build

   # Deploy folder dist
   netlify deploy --prod --dir=dist
   ```

## ⚙️ Pengaturan Tambahan

### Redirects (SPA Support)
File `netlify.toml` yang sudah disiapkan di root project menangani routing untuk Single Page Application (SPA).
Ini memastikan jika user refresh halaman di `/about` atau route lain, tidak akan muncul error 404.

Isi `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Custom Domain
1. Pergi ke **Site configuration** > **Domain management**
2. Klik **"Add a domain"**
3. Ikuti instruksi untuk memverifikasi domain Anda.

## 🛠️ Troubleshooting

### Build Error "Command not found"
Pastikan `package.json` memiliki script build yang benar.
```json
"scripts": {
  "build": "tsc && vite build"
}
```

### Halaman Blank / Putih setelah Deploy
Biasanya karena masalah routing atau env vars.
- Cek console browser (F12) untuk melihat error.
- Pastikan Environment Variables sudah diset di Netlify Dashboard.
- Pastikan `netlify.toml` ada di root folder.

### 404 pada Refresh Page
Pastikan file `netlify.toml` sudah ter-upload ke repository dan isinya benar (bagian `[[redirects]]`).
