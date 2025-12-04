# ⚠️ CRITICAL: Set Midtrans Notification URL

## 🚨 Masalah: Pembayaran Tidak Terkonfirmasi Otomatis

Jika setelah pembayaran berhasil status tetap **FREE**, kemungkinan besar **Notification URL belum diset di Midtrans Dashboard**.

---

## ✅ Solusi: Set Payment Notification URL di Midtrans

### **Step 1: Login ke Midtrans Sandbox Dashboard**

1. Buka: https://dashboard.sandbox.midtrans.com
2. Login dengan akun Midtrans Anda

---

### **Step 2: Set Notification URL**

1. Klik menu **Settings** di sidebar
2. Klik **Configuration**
3. Scroll ke bagian **Payment Notification URL**
4. Masukkan URL ini:
   ```
   https://viywfnjhpnunwhakhnrj.supabase.co/functions/v1/midtrans-webhook
   ```

5. Klik **Update**

---

### **Step 3: Set Finish Redirect URL (Opsional)**

1. Di halaman yang sama, set **Finish Redirect URL:**
   ```
   https://mahirarab.web.id/app/
   ```

2. Set **Error Redirect URL:**
   ```
   https://mahirarab.web.id/
   ```

3. Klik **Update**

---

## 🧪 Test Notification URL

### **Test Manual via Midtrans Dashboard:**

1. **Buka: Settings → Configuration**
2. **Scroll ke** `Payment Notification URL`
3. **Klik "Test"** atau "Send Test Notification"
4. **Check webhook logs:**
   - https://supabase.com/dashboard/project/viywfnjhpnunwhakhnrj/functions/midtrans-webhook/logs
   - Cari log: `=== WEBHOOK RECEIVED ===`
   - Jika ada, berarti webhook sudah jalan ✅

---

## 🔍 Verifikasi Webhook Berfungsi

### **Cek Logs Webhook:**

1. **Buka:** https://supabase.com/dashboard/project/viywfnjhpnunwhakhnrj/functions/midtrans-webhook/logs

2. **Setelah pembayaran test, cek logs:**
   ```
   === WEBHOOK RECEIVED ===
   Timestamp: 2025-12-05T...
   Payload received: {
     "order_id": "MAHIR-...",
     "transaction_status": "settlement",
     "customer_details": {
       "email": "test@example.com"
     }
   }
   Looking for existing profile by email: test@example.com
   Creating new premium profile...
   ✅ SUCCESS! Profile updated/created
   === WEBHOOK COMPLETED ===
   ```

3. **Jika log muncul:** Webhook berhasil! ✅
4. **Jika tidak ada log:** Notification URL belum diset atau salah

---

## 📝 Test Payment Flow Lengkap

### **Scenario Test:**

#### **1. Bayar di Landing Page**
- Buka: https://mahirarab.web.id
- Email: `testwebhook@example.com`
- Bayar dengan kartu test: `4811 1111 1111 1114`
- CVV: `123`, Exp: `01/26`, OTP: `112233`

#### **2. Cek Webhook Logs (PENTING!)**
- Buka: https://supabase.com/dashboard/project/viywfnjhpnunwhakhnrj/functions/midtrans-webhook/logs
- **Refresh** logs setelah payment success
- **Cari log:** `=== WEBHOOK RECEIVED ===`
- **Cek:** `✅ SUCCESS! Profile updated/created`

#### **3. Cek Database**
- Buka: https://supabase.com/dashboard/project/viywfnjhpnunwhakhnrj/editor
- Table: `profiles`
- **Find row** dengan email: `testwebhook@example.com`
- **Cek kolom `status`:** Harus `'premium'` ✅

#### **4. Signup & Login**
- Buka: https://mahirarab.web.id/app/
- Klik **Sign Up**
- Email: `testwebhook@example.com` (SAMA dengan email bayar!)
- Password: buat password
- Sign up → Cek email konfirmasi
- Klik link konfirmasi
- Login

#### **5. Cek Status di App**
- Jika muncul "Akses Premium Diperlukan":
  - Klik **"🔄 Cek Status Pembayaran"**
  - Alert muncul: **"✅ Pembayaran terkonfirmasi!"**
  - Halaman refresh
  - **App terbuka!** 🎉

---

## 🔧 Troubleshooting

### **Problem 1: Webhook Logs Kosong (Tidak Ada Log)**

**Cause:** Notification URL belum diset atau salah

**Solution:**
1. ✅ Pastikan URL **PERSIS** seperti ini:
   ```
   https://viywfnjhpnunwhakhnrj.supabase.co/functions/v1/midtrans-webhook
   ```
2. ✅ Tidak ada spasi di awal/akhir
3. ✅ Tidak ada typo
4. ✅ Klik **Update** di Midtrans Dashboard
5. ✅ Tunggu 1-2 menit
6. ✅ Test payment lagi

---

### **Problem 2: Webhook Logs Ada Tapi Error**

**Cause:** Ada error di webhook function

**Solution:**
1. Cek error message di logs
2. **Common errors:**
   - `Email is required` → customer_details tidak ada di payload
   - `Failed to update user status` → Database error, cek RLS policy
   - `Profile lookup error` → Normal jika profile belum ada

---

### **Problem 3: Webhook Success Tapi Status Tetap FREE**

**Cause:** Profile ter-create tapi tidak ter-link dengan user ID

**Solution:**
1. Login ke app
2. Klik **"🔄 Cek Status Pembayaran"**
3. System akan:
   - Cari profile by user ID
   - Jika tidak ketemu, cari by email
   - Link profile dengan user ID
   - Refresh jika status premium

---

### **Problem 4: Midtrans Sandbox vs Production**

**Important:** 
- Sandbox URL: `https://dashboard.sandbox.midtrans.com`
- Production URL: `https://dashboard.midtrans.com`

Untuk testing, gunakan **Sandbox**!

Ketika go-live:
1. Set ulang Notification URL di **Production Dashboard**
2. URL webhook tetap sama
3. Update Server Key dan Client Key ke production keys

---

## 📋 Checklist Setup

- [ ] Login ke Midtrans Sandbox Dashboard
- [ ] Set Payment Notification URL: `https://viywfnjhpnunwhakhnrj.supabase.co/functions/v1/midtrans-webhook`
- [ ] Set Finish Redirect URL: `https://mahirarab.web.id/app/`
- [ ] Klik **Update** / **Save**
- [ ] Test payment dengan email baru
- [ ] Cek webhook logs setelah payment
- [ ] Verify `✅ SUCCESS!` di logs
- [ ] Cek database profiles table
- [ ] Verify status `premium`
- [ ] Signup dengan email yang sama
- [ ] Login dan test "Cek Status Pembayaran"
- [ ] Confirm app terbuka untuk premium user

---

## 🎯 Expected Logs (Good Example)

```
=== WEBHOOK RECEIVED ===
Timestamp: 2025-12-05T10:30:45.123Z
Payload received: {
  "order_id": "MAHIR-1733398245-abc123xyz",
  "transaction_status": "settlement",
  "fraud_status": "accept",
  "customer_details": {
    "email": "user@example.com",
    "first_name": "user"
  }
}
Extracted email: user@example.com
Transaction status: settlement
Fraud status: accept
Is payment successful? true
Initializing Supabase client...
Looking for existing profile by email: user@example.com
No existing profile found, will create new one
Creating new premium profile...
Insert result: {
  data: [{ email: "user@example.com", status: "premium", ... }],
  error: null
}
✅ SUCCESS! Profile updated/created for: user@example.com
Profile data: [{ email: "user@example.com", status: "premium" }]
=== WEBHOOK COMPLETED ===
```

---

## 📞 Support

Jika masih ada masalah setelah setup:

1. **Cek logs webhook:** Cari error message spesifik
2. **Cek database:** Pastikan profile ter-create dengan status premium
3. **Manual update:** Gunakan SQL manual update (lihat `SUPABASE_EMAIL_SETUP.md`)
4. **Contact:** Buka issue di GitHub repo

---

**Last Updated:** December 5, 2025
**Critical:** Notification URL WAJIB diset untuk auto-upgrade bekerja!
