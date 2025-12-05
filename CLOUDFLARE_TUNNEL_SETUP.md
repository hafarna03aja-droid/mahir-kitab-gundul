# 🌐 Cloudflare Tunnel Setup untuk Webhook Midtrans (Local Development)

## 📋 Verifikasi Setup Anda

### ✅ 1. Port Check - BENAR!
```
Port 54321 = Supabase API Gateway (Kong)
```

**Penjelasan:**
- Port `54321` adalah port **API Gateway** Supabase yang meng-route semua requests
- Edge Functions diakses melalui: `http://localhost:54321/functions/v1/<function-name>`
- Port ini sudah **BENAR** untuk expose webhook

**Port Map Supabase Local:**
```
54321 → API Gateway (Kong) - Untuk Edge Functions
54322 → PostgreSQL Database
54323 → Supabase Studio (Dashboard)
54324 → Inbucket (Email Testing)
54327 → Analytics
```

---

### ✅ 2. Webhook Path - BENAR!
```
Path: /functions/v1/midtrans-webhook
```

**Routing:**
- Local: `http://localhost:54321/functions/v1/midtrans-webhook`
- Tunnel: `https://tunnel-url.trycloudflare.com/functions/v1/midtrans-webhook`
- Production: `https://viywfnjhpnunwhakhnrj.supabase.co/functions/v1/midtrans-webhook`

✅ Path sudah sesuai standar Supabase Edge Functions!

---

### ⚠️ 3. Persistensi - PERLU PERBAIKAN!

**Masalah dengan Quick Tunnel:**
```bash
# ❌ SALAH - URL berubah setiap restart
cloudflared tunnel --url http://localhost:54321
# Output: https://random-abc123.trycloudflare.com (BERUBAH!)
```

---

## 🔧 Solusi: Named Tunnel dengan Custom Domain

### **A. Quick Tunnel (Temporary - Untuk Testing Sekali)**
```bash
# Anonymous tunnel - URL berubah setiap restart
cloudflared tunnel --url http://localhost:54321

# Output:
# https://abc-def-123.trycloudflare.com
# https://xyz-uvw-456.trycloudflare.com (berbeda setiap restart!)
```

**Kapan Pakai:**
- Testing sekali saja
- Demo cepat
- Tidak perlu save URL

---

### **B. Named Tunnel (Persistent - RECOMMENDED)**

#### **Step 1: Login ke Cloudflare**
```powershell
cloudflared tunnel login
```
Output: Browser akan terbuka, pilih domain/zone Anda

---

#### **Step 2: Buat Named Tunnel**
```powershell
# Buat tunnel dengan nama yang mudah diingat
cloudflared tunnel create mahir-arab-webhook

# Output:
# Tunnel credentials written to:
# C:\Users\<user>\.cloudflared\<tunnel-id>.json
# Created tunnel mahir-arab-webhook with id: abc123-def456-...
```

**PENTING:** Simpan Tunnel ID yang muncul!

---

#### **Step 3: Buat Config File**

Buat file: `C:\Users\<YourUser>\.cloudflared\config.yml`

```yaml
# Cloudflare Tunnel Configuration for Supabase Local Webhook
tunnel: abc123-def456-ghi789  # ← Tunnel ID dari step 2
credentials-file: C:\Users\<YourUser>\.cloudflared\abc123-def456-ghi789.json

# Ingress rules
ingress:
  # Route webhook ke Supabase local
  - hostname: webhook.mahirarab.web.id  # ← Custom domain Anda
    service: http://localhost:54321
    originRequest:
      noTLSVerify: true
  
  # Catch-all rule (required)
  - service: http_status:404
```

**Atau tanpa custom domain (subdomain Cloudflare):**
```yaml
tunnel: abc123-def456-ghi789
credentials-file: C:\Users\<YourUser>\.cloudflared\abc123-def456-ghi789.json

ingress:
  - hostname: mahir-arab-webhook.cfargotunnel.com  # ← Auto-generated
    service: http://localhost:54321
  - service: http_status:404
```

---

#### **Step 4: Setup DNS (Jika Pakai Custom Domain)**

```powershell
# Route subdomain ke tunnel
cloudflared tunnel route dns mahir-arab-webhook webhook.mahirarab.web.id

# Output:
# Created CNAME record for webhook.mahirarab.web.id
```

**Hasil di DNS:**
```
webhook.mahirarab.web.id → CNAME → abc123-def456-ghi789.cfargotunnel.com
```

---

#### **Step 5: Run Tunnel**

```powershell
# Jalankan tunnel dengan config
cloudflared tunnel run mahir-arab-webhook

# Atau dengan config file eksplisit
cloudflared tunnel --config C:\Users\<YourUser>\.cloudflared\config.yml run
```

**Output:**
```
2025-12-05 12:00:00 INF Starting tunnel tunnelID=abc123-def456-ghi789
2025-12-05 12:00:01 INF Connection registered connIndex=0
2025-12-05 12:00:01 INF Tunnel running
```

---

## 🚀 Cara Pakai (Step-by-Step)

### **Scenario 1: Testing dengan Quick Tunnel (Temporary)**

```powershell
# Terminal 1: Start Supabase Local
cd "D:\aplikasi mahir arab"
npx supabase start

# Terminal 2: Start Cloudflare Tunnel
cloudflared tunnel --url http://localhost:54321

# Output:
# https://abc-xyz-123.trycloudflare.com
# Connections established

# Copy URL dan paste ke Midtrans Dashboard:
# https://abc-xyz-123.trycloudflare.com/functions/v1/midtrans-webhook
```

**⚠️ URL berubah setiap restart!**

---

### **Scenario 2: Production-like dengan Named Tunnel (Persistent)**

```powershell
# Terminal 1: Start Supabase Local
cd "D:\aplikasi mahir arab"
npx supabase start

# Terminal 2: Start Named Tunnel
cloudflared tunnel run mahir-arab-webhook

# URL TETAP:
# https://webhook.mahirarab.web.id/functions/v1/midtrans-webhook
```

**✅ URL TIDAK berubah saat restart!**

---

## 📝 Set Webhook di Midtrans Dashboard

### **Sandbox Dashboard:**
1. Login: https://dashboard.sandbox.midtrans.com
2. Settings → Configuration
3. Payment Notification URL:
   ```
   https://webhook.mahirarab.web.id/functions/v1/midtrans-webhook
   ```
4. Finish Redirect URL:
   ```
   https://mahirarab.web.id/app/
   ```
5. Save

---

## 🧪 Test Webhook

### **Test 1: Manual Trigger**
```powershell
curl -X POST "https://webhook.mahirarab.web.id/functions/v1/midtrans-webhook" `
  -H "Content-Type: application/json" `
  -d '{
    "order_id": "TEST-LOCAL-001",
    "transaction_status": "settlement",
    "fraud_status": "accept",
    "gross_amount": "49000",
    "customer_details": {
      "email": "testlocal@example.com"
    }
  }'
```

### **Test 2: Check Supabase Logs**
```powershell
# Di terminal Supabase Local
# Logs akan muncul otomatis

# Atau check via CLI
npx supabase functions logs midtrans-webhook --local
```

---

## 📊 Perbandingan: Quick vs Named Tunnel

| Aspek | Quick Tunnel | Named Tunnel |
|-------|-------------|--------------|
| **URL** | Random (berubah) | Fixed (tetap) |
| **Setup** | 1 command | 5 steps setup |
| **Login** | Tidak perlu | Perlu login |
| **Config** | Tidak perlu | Perlu config.yml |
| **Custom Domain** | ❌ Tidak bisa | ✅ Bisa |
| **Persistent** | ❌ Temporary | ✅ Permanent |
| **Use Case** | Quick test | Development |

---

## 🔒 Security Notes

### **1. Firewall Rules**
```powershell
# Allow Cloudflare IPs only
# Add di Windows Firewall atau router Anda
```

### **2. IP Whitelist di Supabase**
Tidak perlu - Cloudflare Tunnel aman by default

### **3. Rate Limiting**
```yaml
# Di config.yml, tambahkan:
ingress:
  - hostname: webhook.mahirarab.web.id
    service: http://localhost:54321
    originRequest:
      connectTimeout: 30s
      noHappyEyeballs: false
```

---

## 🐛 Troubleshooting

### **Issue 1: "Connection refused"**
```powershell
# Check apakah Supabase sudah running
npx supabase status

# Check port
netstat -ano | findstr "54321"
```

### **Issue 2: "Tunnel credentials not found"**
```powershell
# Re-login
cloudflared tunnel login

# Check credentials file
dir C:\Users\<user>\.cloudflared\*.json
```

### **Issue 3: "404 Not Found"**
```powershell
# Check function name
npx supabase functions list

# Check path
curl http://localhost:54321/functions/v1/midtrans-webhook
```

---

## 📦 Complete Example Setup

```powershell
# 1. Setup Named Tunnel (One-time)
cloudflared tunnel login
cloudflared tunnel create mahir-arab-webhook
cloudflared tunnel route dns mahir-arab-webhook webhook.mahirarab.web.id

# 2. Create config.yml
# (See Step 3 above)

# 3. Development Workflow (Daily)
# Terminal 1:
cd "D:\aplikasi mahir arab"
npx supabase start
npx supabase functions serve

# Terminal 2:
cloudflared tunnel run mahir-arab-webhook

# 4. Test
curl https://webhook.mahirarab.web.id/functions/v1/midtrans-webhook
```

---

## ✅ Summary

**Jawaban untuk pertanyaan Anda:**

1. **Port 54321** ✅ **BENAR** - Ini port API Gateway untuk Edge Functions
2. **Path `/functions/v1/midtrans-webhook`** ✅ **BENAR** - Sesuai standar Supabase
3. **Persistensi** ⚠️ **Pakai Named Tunnel** - Quick tunnel URL berubah-ubah

**Recommended Setup:**
```powershell
# Named Tunnel dengan Custom Domain
cloudflared tunnel run mahir-arab-webhook

# URL tetap:
https://webhook.mahirarab.web.id/functions/v1/midtrans-webhook
```

**Untuk Production:**
```
# Pakai URL production Supabase (bukan tunnel)
https://viywfnjhpnunwhakhnrj.supabase.co/functions/v1/midtrans-webhook
```

---

**🎯 Next: Set Named Tunnel untuk persistent URL saat development!**
