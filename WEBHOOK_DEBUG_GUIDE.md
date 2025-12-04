# 🚨 Emergency Fix: Webhook Tidak Menerima Notifikasi

## Masalah: Webhook Logs Kosong Setelah Pembayaran

Jika tidak ada log sama sekali di:
https://supabase.com/dashboard/project/viywfnjhpnunwhakhnrj/functions/midtrans-webhook/logs

Berarti **Midtrans tidak mengirim notifikasi ke webhook Anda**.

---

## ✅ Solusi Cepat

### Step 1: Verifikasi Notification URL di Midtrans

1. **Login:** https://dashboard.sandbox.midtrans.com
2. **Menu:** Settings → Configuration
3. **Cari:** "Payment Notification URL"
4. **Pastikan URL ini terisi:**
   ```
   https://viywfnjhpnunwhakhnrj.supabase.co/functions/v1/midtrans-webhook
   ```
5. **Klik:** Update/Save

**⚠️ Jika field kosong atau URL salah → webhook tidak akan jalan!**

---

### Step 2: Test Webhook Secara Manual

Setelah set Notification URL, test apakah webhook bisa menerima request:

#### **Via curl (di terminal):**

```bash
curl -X POST https://viywfnjhpnunwhakhnrj.supabase.co/functions/v1/midtrans-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "TEST-12345",
    "transaction_status": "settlement",
    "fraud_status": "accept",
    "customer_details": {
      "email": "test@example.com",
      "first_name": "Test"
    }
  }'
```

#### **Via PowerShell:**

```powershell
$body = @{
    order_id = "TEST-12345"
    transaction_status = "settlement"
    fraud_status = "accept"
    customer_details = @{
        email = "test@example.com"
        first_name = "Test"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://viywfnjhpnunwhakhnrj.supabase.co/functions/v1/midtrans-webhook" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User upgraded to premium",
  "email": "test@example.com"
}
```

**Cek Logs Setelah Test:**
- Buka: https://supabase.com/dashboard/project/viywfnjhpnunwhakhnrj/functions/midtrans-webhook/logs
- Refresh
- **Harus ada log:** `=== WEBHOOK RECEIVED ===`

---

### Step 3: Verifikasi di Midtrans Transaction History

1. **Buka:** https://dashboard.sandbox.midtrans.com/transactions
2. **Cari transaksi** yang baru Anda test
3. **Klik** detail transaksi
4. **Tab "Notification":**
   - Cek apakah ada notification attempts
   - Cek response status (harus 200 OK)
   - Jika 404/500 → URL salah atau webhook error

---

## 🔧 Troubleshooting

### Problem 1: Field "Payment Notification URL" Tidak Ada

**Cause:** Anda di menu yang salah

**Solution:**
1. Pastikan Anda di menu: **Settings** → **Configuration**
2. Bukan di: Settings → Access Keys
3. Scroll ke bawah, cari section "Payment Notification URL"
4. Jika tetap tidak ada, hubungi support Midtrans

---

### Problem 2: URL Sudah Diset Tapi Webhook Tidak Jalan

**Cause:** URL typo atau endpoint tidak aktif

**Solution:**
1. **Verifikasi URL PERSIS:**
   ```
   https://viywfnjhpnunwhakhnrj.supabase.co/functions/v1/midtrans-webhook
   ```
2. **Cek tidak ada:**
   - Spasi di awal/akhir
   - Slash (/) di akhir (jangan tambahkan!)
   - Typo di project ID
3. **Test manual** dengan curl/PowerShell (lihat Step 2)
4. Jika test manual berhasil → masalah di Midtrans
5. Jika test manual gagal → masalah di webhook

---

### Problem 3: Webhook Endpoint Returns 404

**Cause:** Function belum di-deploy atau nama salah

**Solution:**
1. **Deploy ulang webhook:**
   ```bash
   npx supabase functions deploy midtrans-webhook
   ```
2. **Verifikasi function exists:**
   - Buka: https://supabase.com/dashboard/project/viywfnjhpnunwhakhnrj/functions
   - Harus ada: `midtrans-webhook`
3. **Test endpoint langsung di browser:**
   - Buka: https://viywfnjhpnunwhakhnrj.supabase.co/functions/v1/midtrans-webhook
   - Jika 404 → function tidak exist
   - Jika 400/500 → function ada tapi error

---

### Problem 4: Transaction History Tidak Mengirim Notifikasi

**Cause:** Notification hanya dikirim untuk transaksi BARU setelah URL diset

**Solution:**
1. **Notification URL hanya berlaku untuk transaksi baru**
2. **Transaksi lama tidak akan re-send notification**
3. **Test dengan pembayaran baru:**
   - Buat transaksi baru
   - Bayar dengan kartu test
   - Cek webhook logs
4. **Atau trigger manual:**
   - Di transaction detail
   - Klik "Resend Notification" (jika ada)

---

## 🎯 Alternative Solution: Manual Trigger Webhook

Jika Notification URL tidak bisa diset atau tidak jalan, Anda bisa **manual trigger** setelah verifikasi pembayaran:

### **Option 1: Trigger via API setelah payment success**

Edit `index.html`, tambahkan setelah payment success:

```javascript
onSuccess: function (result) {
    // Trigger webhook manual
    fetch('https://viywfnjhpnunwhakhnrj.supabase.co/functions/v1/midtrans-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            order_id: result.order_id,
            transaction_status: 'settlement',
            fraud_status: 'accept',
            customer_details: {
                email: email,
                first_name: email.split('@')[0]
            }
        })
    });
    
    alert('✅ Pembayaran berhasil! Silakan login dengan email: ' + email);
    window.location.href = '/app/';
},
```

### **Option 2: Direct Database Update**

Edit payment function untuk langsung update database:

File: `supabase/functions/midtrans-payment/index.ts`

Tambahkan setelah berhasil generate token:

```typescript
// Auto-create premium profile
const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

await supabase.from('profiles').upsert({
    email: email,
    status: 'premium',
    updated_at: new Date().toISOString()
}, { onConflict: 'email' });
```

---

## 📝 Checklist Debug

Lakukan step by step:

- [ ] Login ke Midtrans Sandbox Dashboard
- [ ] Buka Settings → Configuration
- [ ] Verifikasi "Payment Notification URL" terisi dengan URL yang benar
- [ ] Klik Save/Update
- [ ] Test webhook manual dengan curl/PowerShell
- [ ] Cek webhook logs - harus ada log
- [ ] Buat transaksi payment BARU (jangan pakai transaksi lama)
- [ ] Setelah payment success, refresh webhook logs
- [ ] Cari log: `=== WEBHOOK RECEIVED ===`
- [ ] Verifikasi: `✅ SUCCESS! Profile updated/created`
- [ ] Cek database profiles table
- [ ] Verify status = 'premium'

---

## 🆘 Last Resort: Manual Database Update

Jika semua cara di atas gagal, update manual via SQL:

1. **Buka:** https://supabase.com/dashboard/project/viywfnjhpnunwhakhnrj/sql/new

2. **Run SQL ini** (ganti dengan email yang bayar):

```sql
-- Check apakah profile sudah ada
SELECT * FROM profiles WHERE email = 'user@example.com';

-- Jika ada, update ke premium
UPDATE profiles 
SET status = 'premium', 
    updated_at = NOW()
WHERE email = 'user@example.com';

-- Jika belum ada, create baru
INSERT INTO profiles (email, status, created_at, updated_at)
VALUES ('user@example.com', 'premium', NOW(), NOW())
ON CONFLICT (email) 
DO UPDATE SET status = 'premium', updated_at = NOW();

-- Verify hasil
SELECT * FROM profiles WHERE email = 'user@example.com';
```

3. **Logout** dari aplikasi
4. **Login** lagi
5. Status premium seharusnya muncul ✅

---

## 📞 Support

**Midtrans Support:**
- Email: support@midtrans.com
- Docs: https://docs.midtrans.com/reference/notification-endpoint

**Supabase Support:**
- Discord: https://discord.supabase.com
- Docs: https://supabase.com/docs/guides/functions

---

**Priority Action:**
1. ✅ Set Notification URL di Midtrans
2. ✅ Test webhook manual
3. ✅ Test payment baru (bukan transaksi lama)
4. ✅ Cek logs dan database

**Last Updated:** December 5, 2025
