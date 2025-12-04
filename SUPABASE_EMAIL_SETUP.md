# Setup Email Confirmation Redirect URL di Supabase

## 🔗 Masalah: Link Email Konfirmasi Tidak Bisa Dibuka

Ketika user signup, Supabase mengirim email konfirmasi. Default redirect URL mungkin salah sehingga link tidak bisa dibuka.

---

## ✅ Solusi: Set Redirect URL di Supabase Dashboard

### Langkah 1: Login ke Supabase Dashboard

1. Buka: https://supabase.com/dashboard/project/viywfnjhpnunwhakhnrj
2. Login dengan akun Anda

---

### Langkah 2: Set Site URL

1. Klik menu **Authentication** di sidebar kiri
2. Klik **URL Configuration**
3. Set **Site URL:**
   ```
   https://mahirarab.web.id/app/
   ```

---

### Langkah 3: Set Redirect URLs

1. Di bagian **Redirect URLs**, tambahkan:
   ```
   https://mahirarab.web.id/app/
   https://mahirarab.web.id/app
   https://mahirarab.web.id
   http://localhost:5173/app/
   ```

2. Klik **Save**

---

### Langkah 4: Customize Email Templates (Opsional)

1. Klik **Email Templates** di menu Authentication
2. Pilih **Confirm signup**
3. Pastikan `{{ .ConfirmationURL }}` ada di template
4. URL otomatis akan redirect ke Site URL yang sudah diset

---

## 🧪 Test Email Confirmation

### Test Flow:

1. **Bayar di landing page:**
   - Email: `testuser123@example.com`
   - Bayar dengan kartu test Midtrans

2. **Setelah bayar, signup:**
   - Buka: https://mahirarab.web.id/app/
   - Klik **Sign Up**
   - Email: `testuser123@example.com` (sama dengan email bayar)
   - Password: buat password baru
   - Klik **Sign Up**

3. **Cek email:**
   - Buka inbox: `testuser123@example.com`
   - Cari email dari Supabase
   - Klik **Confirm your mail**

4. **Seharusnya redirect ke:**
   - URL: `https://mahirarab.web.id/app/`
   - Status: Already logged in (karena token confirmation)

5. **Jika masih tampil "Akses Premium Diperlukan":**
   - Klik tombol **"🔄 Cek Status Pembayaran"**
   - Akan muncul alert: "✅ Pembayaran terkonfirmasi!"
   - Halaman auto-refresh
   - Aplikasi terbuka! ✨

---

## 🔍 Troubleshooting

### Problem 1: Link Email "Error 404" atau "Page Not Found"

**Cause:** Site URL salah atau redirect URL tidak terdaftar

**Solution:**
1. Cek Site URL di Supabase → harus `https://mahirarab.web.id/app/`
2. Tambahkan semua variasi URL ke Redirect URLs
3. Save dan tunggu 1-2 menit
4. Request email konfirmasi baru (signup lagi dengan email beda)

---

### Problem 2: Link Email Bisa Dibuka Tapi Tidak Auto-Login

**Cause:** Token confirmation tidak tersimpan di session

**Solution:**
1. Setelah klik link email, manual login dengan email & password
2. Halaman akan cek status dan upgrade ke premium otomatis

---

### Problem 3: Login Berhasil Tapi Stuck di "Akses Premium Diperlukan"

**Cause:** Profile belum ter-link dengan user ID, atau webhook belum update status

**Solution:**
1. Klik tombol **"🔄 Cek Status Pembayaran"**
2. Sistem akan:
   - Cari profile by user ID
   - Jika tidak ketemu, cari by email
   - Update profile dengan user ID
   - Refresh halaman jika status premium
3. Jika masih stuck:
   - Logout
   - Login lagi
   - Status premium akan muncul

---

### Problem 4: Status Masih FREE Padahal Sudah Bayar

**Cause:** 
- Email login ≠ email bayar
- Webhook belum jalan
- Profile belum dibuat

**Solution:**
1. Pastikan email login SAMA PERSIS dengan email saat bayar
2. Cek database Supabase:
   - Table Editor → profiles
   - Cari email Anda
   - Cek kolom `status` → harus `'premium'`
3. Jika profile tidak ada:
   - Webhook mungkin gagal
   - Cek logs: https://supabase.com/dashboard/project/viywfnjhpnunwhakhnrj/functions/midtrans-webhook/logs
   - Re-trigger webhook atau manual update database

---

## 📝 Manual Update Status (Emergency Fix)

Jika semua cara di atas gagal, update manual via SQL:

1. Buka: https://supabase.com/dashboard/project/viywfnjhpnunwhakhnrj/sql/new
2. Run SQL ini (ganti email):

```sql
-- Update status ke premium by email
UPDATE profiles 
SET status = 'premium', 
    updated_at = NOW()
WHERE email = 'testuser123@example.com';

-- Check hasil update
SELECT * FROM profiles WHERE email = 'testuser123@example.com';
```

3. Logout dari aplikasi
4. Login lagi
5. Status premium seharusnya muncul ✅

---

## ✅ Checklist Setup

- [ ] Set Site URL di Supabase: `https://mahirarab.web.id/app/`
- [ ] Add Redirect URLs (production + localhost)
- [ ] Test signup dengan email baru
- [ ] Cek email confirmation link bisa dibuka
- [ ] Test login setelah konfirmasi
- [ ] Test "Cek Status Pembayaran" button
- [ ] Verify aplikasi terbuka untuk premium user

---

**Last Updated:** December 5, 2025
