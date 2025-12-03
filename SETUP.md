# Setup Guide - API Keys & Environment Variables

## 🚀 Quick Setup (5 Minutes)

### 1. Copy Environment Template

```bash
cp .env.example .env
```

### 2. Get API Keys

#### Google Gemini API (Required)
1. Visit: https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy key dan paste ke `.env`:
   ```
   VITE_GEMINI_API_KEY=AIza...
   ```

#### Maiarouter API (Optional - untuk model alternatif)
1. Visit: https://maiarouter.ai/dashboard
2. Generate API key
3. Paste ke `.env`:
   ```
   VITE_MAIAROUTER_API_KEY=your_key_here
   ```

#### Midtrans Payment (Required untuk payment)
1. Visit: https://dashboard.midtrans.com
2. Settings → Access Keys
3. Copy **Client Key** (bukan Server Key!)
4. Paste ke `.env`:
   ```
   VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-...
   ```

### 3. Run Development Server

```bash
npm install
npm run dev
```

Open http://localhost:5173

## 🔐 Security Checklist

- ✅ File `.env` ada di `.gitignore`
- ✅ Tidak ada hardcoded keys di code
- ✅ Server keys disimpan di Supabase Secrets
- ✅ Client keys menggunakan environment variables

## 📂 File Structure

```
├── .env                 # ❌ DO NOT COMMIT (lokal saja)
├── .env.example         # ✅ Template untuk reference
├── .gitignore           # ✅ Includes .env*
└── SECURITY.md          # 📖 Security best practices
```

## 🌐 Production Deployment

### Cloudflare Pages

Set environment variables di Dashboard:
1. Pages → mahir-arab-gundul → Settings
2. Environment variables → Add variable
3. Set semua `VITE_*` variables

### Supabase Secrets

Set server-side keys via CLI:

```bash
npx supabase secrets set MIDTRANS_SERVER_KEY=your_server_key_here
```

## ⚠️ Important Notes

1. **NEVER commit `.env` file** - Contains your private keys
2. **Use different keys** for development and production
3. **Client keys** (VITE_*) will be visible in browser
4. **Server keys** must only be in Supabase Secrets
5. **Rotate keys regularly** every 3-6 months

## 🆘 Troubleshooting

### "API Key not valid"
- Check key format (Gemini starts with `AIza`)
- Verify key in provider dashboard
- Check for extra spaces or quotes

### "Environment variable not found"
- Restart dev server after editing `.env`
- Check variable name spelling
- Ensure `.env` is in project root

### Build shows "PLACEHOLDER"
- Set `VITE_MIDTRANS_CLIENT_KEY` in `.env`
- Run `npm run build` again

## 📚 More Info

- [SECURITY.md](./SECURITY.md) - Complete security guide
- [DEPLOYMENT_CLOUDFLARE.md](./DEPLOYMENT_CLOUDFLARE.md) - Deploy instructions
- [README.md](./README.md) - Project overview

## 🔗 Quick Links

- [Google Gemini API](https://aistudio.google.com/apikey)
- [Maiarouter Dashboard](https://maiarouter.ai/dashboard)
- [Midtrans Dashboard](https://dashboard.midtrans.com)
- [Supabase Dashboard](https://supabase.com/dashboard)
