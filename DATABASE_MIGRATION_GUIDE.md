# Cara Menjalankan Database Migration

## 🗄️ Update Schema Profiles Table

Migration ini diperlukan untuk mendukung user yang **bayar dulu sebelum signup**.

### Langkah-langkah:

1. **Login ke Supabase Dashboard**
   - Buka: https://supabase.com/dashboard/project/viywfnjhpnunwhakhnrj

2. **Buka SQL Editor**
   - Klik menu **SQL Editor** di sidebar kiri
   - Atau buka: https://supabase.com/dashboard/project/viywfnjhpnunwhakhnrj/sql/new

3. **Jalankan SQL Migration**
   - Copy SQL dari file: `supabase/migrations/fix_profiles_schema.sql`
   - Paste ke SQL Editor
   - Klik **Run** atau tekan **Ctrl+Enter**

### SQL Query:

```sql
-- Fix profiles table schema to support users who pay before signup
-- This allows webhook to create profiles without user ID first

-- Make id column nullable temporarily to allow payment-first users
ALTER TABLE profiles ALTER COLUMN id DROP NOT NULL;

-- Add constraint to ensure either id exists OR email exists
ALTER TABLE profiles ADD CONSTRAINT profiles_id_or_email_check 
    CHECK (id IS NOT NULL OR email IS NOT NULL);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Add comment for documentation
COMMENT ON COLUMN profiles.id IS 'User ID from auth.users - can be NULL for payment-first users until they signup';
COMMENT ON COLUMN profiles.email IS 'User email - used to link payment to account';
COMMENT ON COLUMN profiles.status IS 'Account status: free or premium';
```

4. **Verifikasi**
   - Setelah run berhasil, cek Table Editor
   - Table: **profiles**
   - Kolom **id** sekarang boleh NULL
   - Index **idx_profiles_email** sudah dibuat

---

## 🔄 Flow Setelah Migration

### Scenario 1: User Bayar → Signup → Login
1. User bayar di landing page dengan email: `user@example.com`
2. Webhook create profile: `{email: 'user@example.com', id: NULL, status: 'premium'}`
3. User signup dengan email yang sama
4. System update profile: `{email: 'user@example.com', id: 'auth-id-123', status: 'premium'}`
5. User bisa login dan langsung premium ✅

### Scenario 2: User Signup → Bayar → Login
1. User signup dulu
2. Profile dibuat: `{email: 'user@example.com', id: 'auth-id-123', status: 'free'}`
3. User bayar
4. Webhook update: `{email: 'user@example.com', id: 'auth-id-123', status: 'premium'}`
5. User login dan sudah premium ✅

---

## ✅ Setelah Migration

Test flow pembayaran:
1. Buka: https://mahirarab.web.id
2. Bayar dengan email baru (belum pernah signup)
3. Setelah bayar, buka: https://mahirarab.web.id/app/
4. Klik "Sign Up"
5. Daftar dengan email yang sama saat bayar
6. Cek email konfirmasi
7. Klik link konfirmasi
8. Login → Status langsung premium! 🎉

---

**Last Updated:** December 4, 2025
