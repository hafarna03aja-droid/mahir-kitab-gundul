# Panduan Deploy ke GitHub & Vercel

## 📝 Persiapan

### 1. Pastikan Git terinstall
```bash
git --version
```

### 2. Buat Repository di GitHub
1. Login ke [github.com](https://github.com)
2. Klik tombol "New" (repository baru)
3. Nama repository: `mahir-arab-gundul`
4. Visibility: Public atau Private
5. **JANGAN** centang "Initialize with README" (sudah ada)
6. Klik "Create repository"

## 🚀 Push ke GitHub

### Inisialisasi Git (jika belum)
```bash
cd "d:\aplikasi mahir arab"
git init
git add .
git commit -m "Initial commit: Mahir Arab Gundul Platform"
```

### Connect ke GitHub Repository
```bash
# Ganti YOUR_USERNAME dengan username GitHub Anda
git remote add origin https://github.com/YOUR_USERNAME/mahir-arab-gundul.git
git branch -M main
git push -u origin main
```

## 🌐 Deploy ke Vercel

### Opsi 1: Via Dashboard (Recommended)

1. **Login ke Vercel**
   - Kunjungi [vercel.com](https://vercel.com)
   - Login dengan GitHub account

2. **Import Repository**
   - Klik "Add New..." → "Project"
   - Pilih repository `mahir-arab-gundul`
   - Klik "Import"

3. **Configure Project**
   - Framework Preset: **Vite** (auto-detect)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables**
   Klik "Environment Variables" dan tambahkan:
   ```
   VITE_GEMINI_API_KEY=your_maiarouter_key
   VITE_MAIAROUTER_URL=https://api.maiarouter.ai/v1/chat/completions
   VITE_GOOGLE_GEMINI_API_KEY=your_google_key (optional)
   VITE_SUPABASE_URL=https://viywfnjhpnunwhakhnrj.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Deploy**
   - Klik "Deploy"
   - Tunggu proses build (2-3 menit)
   - Selesai! 🎉

### Opsi 2: Via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (pilih account Anda)
# - Link to existing project? N
# - Project name: mahir-arab-gundul
# - Directory: ./ (enter)
# - Override settings? N

# Production deploy
vercel --prod
```

## ⚙️ Environment Variables di Vercel

### Via Dashboard:
1. Buka project di Vercel
2. Settings → Environment Variables
3. Tambahkan variable satu per satu
4. Pilih environment: Production, Preview, Development

### Via CLI:
```bash
vercel env add VITE_GEMINI_API_KEY
# Paste your API key
# Select environments (use space to select, enter to confirm)

vercel env add VITE_MAIAROUTER_URL
vercel env add VITE_GOOGLE_GEMINI_API_KEY
```

## 🔄 Auto Deploy

Setelah setup, setiap push ke GitHub akan otomatis trigger deploy:

```bash
# Make changes
git add .
git commit -m "Update feature X"
git push

# Vercel automatically deploys! 🚀
```

## 📊 Monitoring

### Vercel Dashboard
- **Deployments**: Lihat history deploy
- **Analytics**: Traffic dan performance
- **Logs**: Runtime logs dan errors

### Custom Domain (Optional)
1. Settings → Domains
2. Add domain Anda
3. Update DNS records sesuai instruksi
4. Tunggu propagasi (5-10 menit)

## 🛠️ Troubleshooting

### Build Error
```bash
# Test build locally
npm run build

# Check output
npm run preview
```

### Environment Variables tidak terbaca
- Pastikan prefix `VITE_` ada
- Redeploy after adding env vars
- Check Logs di Vercel dashboard

### 404 Error pada routes
- Pastikan `vercel.json` sudah ter-commit
- Check rewrites configuration

## 📱 Share Project

Setelah deploy berhasil:
- Production URL: `https://mahir-arab-gundul.vercel.app`
- Custom domain: `https://yourdomain.com`

## 🔐 Security Checklist

- [x] `.env` file di-ignore (tidak di-push ke GitHub)
- [x] API keys disimpan di Vercel Environment Variables
- [x] Security headers configured di `vercel.json`
- [x] Dependencies up-to-date

## 📞 Support

Jika ada masalah:
1. Check [Vercel Documentation](https://vercel.com/docs)
2. Check build logs di Vercel dashboard
3. Contact: contact@24learningcentre.com

---

**Selamat! Aplikasi Anda sudah live! 🎉**
