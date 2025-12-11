# 🚀 QUICK START - PRODUCTION

## Mahir Arab Gundul - Go Live Checklist

**Total Time:** ~10 minutes  
**Difficulty:** Easy ⭐

---

## ✅ STEP 1: Verify Backend (2 min)

```bash
# Check all Edge Functions are active
npx supabase functions list
```

**Expected Output:**
```
midtrans-payment v44 - ACTIVE ✅
midtrans-webhook v35 - ACTIVE ✅
midtrans-config  v14 - ACTIVE ✅
```

**If not active:** Redeploy functions
```bash
npx supabase functions deploy midtrans-payment
npx supabase functions deploy midtrans-webhook
npx supabase functions deploy midtrans-config
```

---

## ✅ STEP 2: Set Cloudflare Environment Variables (3 min)

**IMPORTANT:** Cloudflare Pages tidak baca file `.env` lokal!

### A. Login ke Cloudflare Dashboard
1. Buka https://dash.cloudflare.com/
2. Login dengan akun Anda

### B. Navigate ke Project
1. Klik **Pages** di sidebar
2. Pilih project: **mahir-kitab-gundul**

### C. Add Environment Variables
1. Klik tab **Settings**
2. Scroll ke **Environment variables**
3. Klik **Add variable** untuk Production

**Variables to add:**
```
Name: VITE_MIDTRANS_CLIENT_KEY
Value: Mid-client-N8v5q9LUYAGiokGy
Environment: Production

Name: VITE_SUPABASE_URL
Value: https://viywfnjhpnunwhakhnrj.supabase.co
Environment: Production

Name: VITE_SUPABASE_ANON_KEY
Value: [Get from Supabase Dashboard → Project Settings → API → anon public]
Environment: Production
```

### D. Trigger Deployment
1. Klik **Save**
2. Go to **Deployments** tab
3. Klik **Retry deployment** pada latest deployment
4. Tunggu 2-3 menit

---

## ✅ STEP 3: Test Payment Flow (5 min)

### A. Test di Desktop (localhost)
```bash
# Run development server
npm run dev
```

1. Buka http://localhost:5173
2. Klik "Upgrade ke Premium"
3. Input email: `desktop-test@example.com`
4. Klik "Bayar Sekarang"
5. **Expected:** Midtrans popup muncul ✅

### B. Test di Mobile (production)

**WAIT 5 MINUTES** after Cloudflare deployment completes!

1. Buka **Incognito mode** di mobile browser
2. Navigate to https://mahirarab.web.id
3. Klik "Upgrade ke Premium"
4. Input email: `mobile-test@example.com`
5. Klik "Bayar Sekarang"
6. **Expected:** Midtrans popup muncul ✅

**If error occurs:**
- Clear browser cache completely
- Try different browser
- Check Cloudflare deployment status
- Verify environment variables saved

---

## ✅ STEP 4: Test Complete Payment Flow

### Use Test Card (Midtrans Sandbox Simulation):
```
Card Number: 4811 1111 1111 1114
Expiry: 01/27
CVV: 123
OTP: 112233
```

### Complete Payment:
1. Enter test card details
2. Click "Pay"
3. Enter OTP: `112233`
4. Verify payment success

### Verify Premium Activation:
```bash
# Check database
npx supabase db sql "SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;"
npx supabase db sql "SELECT email, status FROM profiles WHERE email='mobile-test@example.com';"
```

**Expected:**
- Order created with status `settlement` ✅
- Profile status changed to `premium` ✅

---

## ✅ STEP 5: Monitor Webhook

### Check Webhook Logs:
```bash
npx supabase functions logs midtrans-webhook --tail
```

### Verify Midtrans Notification:
1. Login to https://dashboard.midtrans.com
2. Go to **Settings** → **Notification**
3. Check notification history
4. **Expected:** 200 OK responses ✅

### Test Webhook Manually:
```bash
curl -X POST https://mahirarab.web.id/webhook/midtrans \
  -H "Content-Type: application/json" \
  -d '{"order_id":"TEST-123","transaction_status":"settlement","fraud_status":"accept","status_code":"200","gross_amount":"49000"}'
```

**Expected:** Webhook receives and processes ✅

---

## 🎉 YOU'RE LIVE!

**If all tests passed, your application is:**
- ✅ Accepting real payments
- ✅ Activating premium users automatically
- ✅ Receiving webhook notifications
- ✅ Mobile-optimized
- ✅ Production-ready

---

## 🔍 QUICK TROUBLESHOOTING

### Error: "Invalid JWT"
**Fix:**
1. Verify Cloudflare environment variables set
2. Trigger manual deployment
3. Clear mobile cache / use incognito

### Error: "Failed to fetch"
**Fix:**
1. Check internet connection
2. Verify Supabase Edge Functions active
3. Check CORS configuration

### Error: Timeout
**Fix:**
1. Already implemented (15s timeout)
2. Use better internet connection
3. Fallback config should activate automatically

### Webhook 401 Error
**Fix:**
1. Verify Cloudflare Worker deployed
2. Test: `curl https://mahirarab.web.id/webhook/midtrans`
3. Check `_worker.js` file exists in project root

---

## 📞 EMERGENCY CONTACTS

**Midtrans Support:**
- Email: support@midtrans.com
- Phone: +62-21-2212-1234

**Supabase Support:**
- Dashboard: https://supabase.com/dashboard/support

**Cloudflare Support:**
- Dashboard: https://dash.cloudflare.com/support

---

## 🔄 ROLLBACK PROCEDURE

**If something goes wrong:**

```bash
# 1. Revert to previous commit
git log --oneline -5  # Find good commit hash
git revert [bad_commit_hash]
git push origin main

# 2. Or reset to specific version
git reset --hard c2f311d  # Known good commit
git push --force origin main

# 3. Redeploy functions
npx supabase functions deploy --project-ref viywfnjhpnunwhakhnrj
```

---

## 📊 MONITORING DASHBOARD

**Add to bookmarks:**
- Supabase: https://supabase.com/dashboard/project/viywfnjhpnunwhakhnrj
- Midtrans: https://dashboard.midtrans.com
- Cloudflare: https://dash.cloudflare.com
- Production: https://mahirarab.web.id

**Check daily:**
- [ ] Payment success rate
- [ ] Webhook delivery rate
- [ ] Error logs
- [ ] User complaints

---

**Ready to accept your first real payment!** 💰

*Good luck! 🚀*
