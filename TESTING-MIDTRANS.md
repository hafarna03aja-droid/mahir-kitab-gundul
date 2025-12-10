# 🧪 Panduan Testing Midtrans Payment Integration

## 📋 Pre-Testing Checklist

Sebelum mulai testing, pastikan:

- ✅ Semua Edge Functions sudah di-deploy
- ✅ Semua secrets sudah diset di Supabase
- ✅ Development server running (`npm run dev`)
- ✅ Browser DevTools terbuka (F12)

## 🎯 Testing Scenarios

### 1️⃣ Test Sandbox Mode (Current)

**Expected Configuration:**
```json
{
  "isProduction": false,
  "clientKey": "Mid-client-W4qSN0B-zyY2x_dN",
  "scriptUrl": "https://app.sandbox.midtrans.com/snap/snap.js"
}
```

**Test Steps:**

#### A. Test Config Loading
1. Buka aplikasi: http://localhost:5173
2. Buka DevTools Console (F12)
3. Refresh halaman
4. Cari log: `🔄 Fetching Midtrans configuration...`
5. Harus muncul: `✅ Midtrans config loaded`
6. Harus muncul: `✅ Midtrans Snap.js loaded successfully`

**Expected Console Output:**
```
🔄 Fetching Midtrans configuration...
✅ Midtrans config loaded: {
  environment: 'Sandbox',
  scriptUrl: 'https://app.sandbox.midtrans.com/snap/snap.js'
}
✅ Midtrans Snap.js loaded successfully
```

#### B. Test Payment Flow
1. Klik tombol **"Berlangganan Premium"** atau **"Ambil Promo Sekarang"**
2. Modal email harus muncul
3. Input email: `test@example.com`
4. Klik **"Lanjut ke Pembayaran"**
5. Popup Midtrans Snap harus muncul (halaman baru atau overlay)

#### C. Test Sandbox Payment
Gunakan **test card** berikut:

```
Card Number: 4811 1111 1111 1114
CVV: 123
Expiry Date: 01/30
OTP: 112233
```

**Step-by-step:**
1. Pilih metode: **Credit Card**
2. Input card number: `4811 1111 1111 1114`
3. Input CVV: `123`
4. Input expiry: `01/30`
5. Klik **Pay**
6. Masukkan OTP: `112233`
7. Klik **Submit**

**Expected Result:**
- ✅ Payment Success
- ✅ Redirect ke `/app` atau homepage
- ✅ Alert: "Pembayaran Berhasil!"
- ✅ Check database `orders` table → status: `settlement`
- ✅ Check `users` table → `is_premium`: `true`

#### D. Test Webhook (Automatic)
Setelah payment success:
1. Buka Supabase Dashboard → Table Editor → `orders`
2. Cari order dengan email `test@example.com`
3. Status harus: `settlement`
4. `snap_token` harus terisi
5. `midtrans_response` harus ada data

### 2️⃣ Test Production Mode (After Sandbox Success)

**⚠️ WARNING:** Production menggunakan uang asli!

#### Switch to Production

**Via Supabase Dashboard:**
1. Buka: https://supabase.com/dashboard/project/viywfnjhpnunwhakhnrj/settings/functions
2. Tab **Secrets**
3. Edit `IS_PRODUCTION` → Value: `true`
4. Save

**Via CLI:**
```powershell
npx supabase secrets set IS_PRODUCTION=true
```

#### Verify Production Config
```powershell
curl -X GET "https://viywfnjhpnunwhakhnrj.supabase.co/functions/v1/midtrans-config"
```

**Expected Response:**
```json
{
  "isProduction": true,
  "clientKey": "Mid-client-10LU0ymSujDEl4Hi",
  "scriptUrl": "https://app.midtrans.com/snap/snap.js"
}
```

#### Test Production Payment
1. Refresh aplikasi
2. Check console: Environment harus `Production`
3. Klik **"Berlangganan Premium"**
4. Input email asli
5. **Use real payment method** (kartu kredit asli, e-wallet, dll)
6. **Complete real payment** (akan charge Rp 49,000)

**Expected Result:**
- ✅ Payment Success
- ✅ Money deducted from account
- ✅ Transaction appears in Midtrans Production Dashboard
- ✅ User gets premium access

## 🐛 Troubleshooting

### Issue: "Midtrans belum siap"

**Symptoms:**
- Button disabled
- Loading spinner stuck
- Console error: Failed to fetch config

**Solutions:**
1. Check Edge Functions deployed:
   ```powershell
   npx supabase functions list
   ```
2. Check secrets set:
   ```powershell
   curl https://viywfnjhpnunwhakhnrj.supabase.co/functions/v1/midtrans-config
   ```
3. Redeploy functions:
   ```powershell
   npx supabase functions deploy midtrans-config
   npx supabase functions deploy midtrans-payment
   ```

### Issue: "Failed to create transaction"

**Symptoms:**
- Payment modal doesn't open
- Console error: 401 Unauthorized or 400 Bad Request

**Solutions:**
1. Check server key is set:
   - Sandbox: `SB_SERVER_KEY`
   - Production: `PROD_SERVER_KEY`
2. Verify key format:
   - Must be: `Mid-server-xxxxxxxxxxxxx`
   - No spaces at start/end
3. Check Supabase function logs:
   ```powershell
   npx supabase functions logs midtrans-payment --tail
   ```

### Issue: Wrong environment loading

**Symptoms:**
- Sandbox mode but production key shows
- Or vice versa

**Solutions:**
1. Check `IS_PRODUCTION` value:
   ```powershell
   curl https://viywfnjhpnunwhakhnrj.supabase.co/functions/v1/midtrans-config
   ```
2. Verify correct secrets are set:
   - Sandbox: `SB_CLIENT_KEY`, `SB_SERVER_KEY`
   - Production: `PROD_CLIENT_KEY`, `PROD_SERVER_KEY`
3. Clear browser cache and reload

### Issue: Payment success but user not premium

**Symptoms:**
- Payment completed
- Money deducted
- But `is_premium` still `false`

**Solutions:**
1. Check webhook function deployed:
   ```powershell
   npx supabase functions deploy midtrans-webhook
   ```
2. Check webhook URL in Midtrans Dashboard:
   - Should be: `https://viywfnjhpnunwhakhnrj.supabase.co/functions/v1/midtrans-webhook`
3. Manually trigger webhook or check `orders` table status
4. Run manual update:
   ```sql
   UPDATE users 
   SET is_premium = true, subscription_status = 'active'
   WHERE email = 'test@example.com';
   ```

## 📊 Monitoring

### Supabase Logs
```powershell
# Config function logs
npx supabase functions logs midtrans-config --tail

# Payment function logs
npx supabase functions logs midtrans-payment --tail

# Webhook logs
npx supabase functions logs midtrans-webhook --tail
```

### Midtrans Dashboard

**Sandbox:**
- URL: https://dashboard.sandbox.midtrans.com
- Check: Transactions → All transactions
- Look for: Order ID starting with `MAHIR-`

**Production:**
- URL: https://dashboard.midtrans.com
- Check: Transactions → All transactions
- Verify: Real money transactions

### Database Checks

**Orders Table:**
```sql
SELECT * FROM orders 
ORDER BY created_at DESC 
LIMIT 10;
```

**Users Table:**
```sql
SELECT email, is_premium, subscription_status, updated_at 
FROM users 
WHERE is_premium = true
ORDER BY updated_at DESC;
```

## ✅ Test Checklist

### Sandbox Testing
- [ ] Config API returns sandbox configuration
- [ ] Script loads from sandbox.midtrans.com
- [ ] Payment button enabled after script loads
- [ ] Email modal opens on click
- [ ] Payment request creates order in database
- [ ] Midtrans popup opens with sandbox environment
- [ ] Test card payment succeeds
- [ ] User redirected after success
- [ ] Order status updated to `settlement`
- [ ] User `is_premium` becomes `true`

### Production Testing
- [ ] Config API returns production configuration
- [ ] Script loads from app.midtrans.com (no sandbox)
- [ ] Real payment methods available
- [ ] Payment processes with real money
- [ ] Transaction appears in production dashboard
- [ ] Webhook updates database correctly
- [ ] User gets premium access immediately

## 🎯 Success Criteria

**Sandbox:**
- ✅ All test payments complete successfully
- ✅ No console errors
- ✅ Database updates correctly
- ✅ Users get premium access

**Production:**
- ✅ Real payments process successfully
- ✅ Money reaches merchant account
- ✅ No failed transactions
- ✅ All webhooks fire correctly

## 📞 Support

**Issues?**
- Check Supabase function logs
- Check Midtrans transaction status
- Check browser console errors
- Check database records

**Need Help?**
- Midtrans Docs: https://docs.midtrans.com
- Supabase Docs: https://supabase.com/docs
- Create issue in repository

---

**Last Updated:** 2025-12-10
**Version:** 1.0
**Status:** Ready for Testing
