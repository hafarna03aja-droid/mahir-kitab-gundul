# Security Best Practices

## 🔐 API Keys Management

### Environment Variables

Semua API keys dan secrets disimpan sebagai environment variables, **TIDAK** hardcoded di code.

### Frontend (Public)

Environment variables yang aman untuk frontend (dimulai dengan `VITE_`):

```env
VITE_GEMINI_API_KEY=your_key_here          # Google Gemini API
VITE_MAIAROUTER_URL=https://...            # Maiarouter endpoint
VITE_MIDTRANS_CLIENT_KEY=your_key_here     # Midtrans Client Key (public)
VITE_SUPABASE_URL=https://...              # Supabase URL (public)
VITE_SUPABASE_ANON_KEY=your_key_here       # Supabase Anon Key (public)
```

⚠️ **PENTING**: Keys ini akan ter-bundle di frontend dan **visible** di browser. Pastikan menggunakan:
- API keys dengan proper restrictions/permissions
- Rate limiting di API provider
- Anon keys (bukan service role keys)

### Backend (Private)

Secrets yang harus disimpan di **Supabase Secrets** (tidak pernah di-commit):

```bash
# Set via Supabase CLI
npx supabase secrets set MIDTRANS_SERVER_KEY=your_server_key_here
```

Keys ini:
- ❌ Tidak boleh di-commit ke Git
- ❌ Tidak boleh di-bundle ke frontend
- ✅ Hanya accessible di Supabase Edge Functions
- ✅ Stored encrypted di Supabase

## 🚫 Files yang Tidak Boleh Di-commit

Pastikan `.gitignore` includes:

```
.env
.env.local
.env.*.local
```

## ✅ Files yang Aman Di-commit

- `.env.example` - Template dengan placeholder values
- `README.md` - Dokumentasi publik
- Code dengan placeholder references (`process.env.VITE_*`)

## 🔄 Deployment Setup

### Cloudflare Pages

Set environment variables di Dashboard:
1. Dashboard → Pages → mahir-arab-gundul
2. Settings → Environment variables
3. Add variables:
   - `VITE_GEMINI_API_KEY`
   - `VITE_MIDTRANS_CLIENT_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Supabase Functions

Set secrets via CLI:

```bash
# Set Midtrans Server Key (NEVER expose to frontend)
npx supabase secrets set MIDTRANS_SERVER_KEY=your_server_key_here

# Verify secrets are set
npx supabase secrets list
```

## 🛡️ Security Checklist

- [ ] No hardcoded API keys in code
- [ ] `.env` file in `.gitignore`
- [ ] `.env.example` has placeholders only
- [ ] Server-side keys only in Supabase Secrets
- [ ] Client keys have proper restrictions
- [ ] Rate limiting enabled on API providers
- [ ] CORS properly configured
- [ ] CSP headers set correctly

## 🚨 If API Key Leaked

1. **Immediately revoke** the exposed key
2. Generate new key from provider dashboard
3. Update environment variables in:
   - Local `.env` file
   - Cloudflare Pages dashboard
   - Supabase Secrets
4. Redeploy applications
5. Monitor for unauthorized usage

## 📝 Best Practices

1. **Rotate keys regularly** (every 3-6 months)
2. **Use different keys** for dev/staging/production
3. **Monitor API usage** for anomalies
4. **Set spending limits** on paid APIs
5. **Enable notifications** for suspicious activity
6. **Document** where each key is used
7. **Audit** access logs periodically

## 🔗 References

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Supabase Secrets Management](https://supabase.com/docs/guides/functions/secrets)
- [Cloudflare Pages Environment Variables](https://developers.cloudflare.com/pages/configuration/build-configuration/)
