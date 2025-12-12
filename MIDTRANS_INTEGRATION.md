# Midtrans Payment Integration

Panduan lengkap integrasi payment gateway Midtrans untuk Mahir Arab.

---

## 🚀 Quick Setup

### 1. Set Environment Variables (Supabase)

```powershell
# Mode: sandbox atau production
npx supabase secrets set IS_PRODUCTION=false

# Sandbox credentials
npx supabase secrets set SB_SERVER_KEY=your_sandbox_server_key
npx supabase secrets set SB_CLIENT_KEY=your_sandbox_client_key

# Production credentials (saat go-live)
npx supabase secrets set PROD_SERVER_KEY=your_production_server_key
npx supabase secrets set PROD_CLIENT_KEY=your_production_client_key
```

### 2. Set Webhook URL di Midtrans Dashboard

**Sandbox:** https://dashboard.sandbox.midtrans.com
**Production:** https://dashboard.midtrans.com

1. Settings → Configuration
2. **Payment Notification URL:**
   ```
   https://viywfnjhpnunwhakhnrj.supabase.co/functions/v1/midtrans-webhook
   ```
3. **Finish Redirect URL:** `https://mahirarab.web.id/app/`
4. Klik **Update**

---

## 🧪 Testing (Sandbox)

1. Set `IS_PRODUCTION=false`
2. Test card: `4811 1111 1111 1114`
3. CVV: `123`, Exp: `01/26`, OTP: `112233`

### Verify Webhook:
```powershell
npx supabase functions logs midtrans-webhook --tail
```

Logs yang benar:
```
=== WEBHOOK RECEIVED ===
transaction_status: settlement
✅ SUCCESS! Profile updated/created
=== WEBHOOK COMPLETED ===
```

---

## 🔄 Switch Environment

```powershell
# Sandbox mode (testing)
npx supabase secrets set IS_PRODUCTION=false

# Production mode (real money)
npx supabase secrets set IS_PRODUCTION=true
```

---

## 📁 Arsitektur

| Component | Location |
|-----------|----------|
| `midtrans-payment` | `supabase/functions/midtrans-payment/` |
| `midtrans-webhook` | `supabase/functions/midtrans-webhook/` |
| `midtrans-config` | `supabase/functions/midtrans-config/` |
| `useMidtrans` hook | `src/hooks/useMidtrans.ts` |
| `CheckoutButton` | `src/components/CheckoutButton.tsx` |

---

## 🛠️ Troubleshooting

### "Midtrans belum siap"
- Cek browser console
- Verify config endpoint accessible
- Pastikan env variables diset

### Webhook logs kosong
- Pastikan Notification URL sudah diset di Midtrans Dashboard
- URL harus PERSIS: `https://viywfnjhpnunwhakhnrj.supabase.co/functions/v1/midtrans-webhook`

### Status tetap FREE setelah bayar
1. Login ke app
2. Klik **"🔄 Cek Status Pembayaran"**
3. System akan link profile dengan user

---

## 🔒 Security

**Aman di client:** Client Key, Script URL, isProduction flag

**Jangan expose:** Server Key, Supabase Service Role Key

---

**Last Updated:** December 2025
