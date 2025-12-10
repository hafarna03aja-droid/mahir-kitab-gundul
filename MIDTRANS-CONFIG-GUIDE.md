# Midtrans Payment Integration - Configuration Guide

## Overview

This project uses **dynamic environment switching** for Midtrans payment gateway integration. The system automatically loads the correct configuration (Sandbox or Production) based on a single environment variable.

## Architecture

### Backend (Supabase Edge Functions)

1. **`midtrans-payment`** - Creates Snap payment tokens
   - Location: `supabase/functions/midtrans-payment/index.ts`
   - Switches between sandbox/production based on `IS_PRODUCTION` flag

2. **`midtrans-config`** - Provides client-side configuration
   - Location: `supabase/functions/midtrans-config/index.ts`
   - Returns client key and script URL for frontend

### Frontend (React)

1. **`useMidtrans` Hook** - Dynamically loads Midtrans Snap.js
   - Location: `src/hooks/useMidtrans.ts`
   - Fetches config from backend API
   - Loads appropriate script (sandbox/production)
   - Provides loading states and error handling

2. **`CheckoutButton` Component** - Payment interface
   - Location: `src/components/CheckoutButton.tsx`
   - Uses `useMidtrans` hook
   - Handles payment flow

## Environment Variables

### Required Variables (Supabase Dashboard → Settings → Edge Functions)

```env
# Environment Mode (controls everything)
IS_PRODUCTION=false          # Set to 'true' for production, 'false' for sandbox

# Sandbox Credentials
SB_SERVER_KEY=your_sandbox_server_key_here
SB_CLIENT_KEY=your_sandbox_client_key_here

# Production Credentials
PROD_SERVER_KEY=your_production_server_key_here
PROD_CLIENT_KEY=your_production_client_key_here
```

### How to Get Midtrans Credentials

1. **Sandbox (Testing)**
   - Go to: https://dashboard.sandbox.midtrans.com/
   - Navigate to: Settings → Access Keys
   - Copy: Server Key and Client Key

2. **Production (Live Payments)**
   - Go to: https://dashboard.midtrans.com/
   - Navigate to: Settings → Access Keys
   - Copy: Server Key and Client Key

## Deployment Steps

### 1. Deploy Edge Functions

```powershell
# Deploy payment endpoint
supabase functions deploy midtrans-payment

# Deploy config endpoint
supabase functions deploy midtrans-config
```

### 2. Set Environment Variables

**Via Supabase CLI:**
```powershell
# Set environment mode (IMPORTANT!)
supabase secrets set IS_PRODUCTION=false

# Set sandbox credentials
supabase secrets set SB_SERVER_KEY=your_sandbox_server_key
supabase secrets set SB_CLIENT_KEY=your_sandbox_client_key

# Set production credentials (when ready)
supabase secrets set PROD_SERVER_KEY=your_production_server_key
supabase secrets set PROD_CLIENT_KEY=your_production_client_key
```

**Via Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Navigate to: **Settings** → **Edge Functions** → **Secrets**
4. Add each environment variable

### 3. Verify Configuration

Test the config endpoint:
```powershell
curl https://your-project.supabase.co/functions/v1/midtrans-config `
  -H "Authorization: Bearer YOUR_ANON_KEY" `
  -H "apikey: YOUR_ANON_KEY"
```

Expected response (Sandbox mode):
```json
{
  "isProduction": false,
  "clientKey": "SB-Mid-client-xxxxx",
  "scriptUrl": "https://app.sandbox.midtrans.com/snap/snap.js"
}
```

## Switching Environments

### To Use Sandbox (Testing)
```powershell
supabase secrets set IS_PRODUCTION=false
```

### To Use Production (Live Payments)
```powershell
supabase secrets set IS_PRODUCTION=true
```

**Note:** After changing `IS_PRODUCTION`, you may need to redeploy functions:
```powershell
supabase functions deploy midtrans-payment
supabase functions deploy midtrans-config
```

## Testing

### Sandbox Testing

1. Set `IS_PRODUCTION=false`
2. Use test credit card: `4811 1111 1111 1114`
3. Complete payment flow
4. Check Midtrans sandbox dashboard for transaction

### Production Testing

⚠️ **WARNING:** Production uses real money!

1. Set `IS_PRODUCTION=true`
2. Use a small amount for testing (e.g., Rp 1,000)
3. Use a real payment method
4. Verify in Midtrans production dashboard

## Troubleshooting

### Issue: "Midtrans belum siap"

**Cause:** Frontend can't load Midtrans script

**Solutions:**
1. Check browser console for errors
2. Verify config endpoint is accessible:
   ```
   https://your-project.supabase.co/functions/v1/midtrans-config
   ```
3. Check CORS settings on Edge Functions
4. Ensure environment variables are set

### Issue: "Server Key not found"

**Cause:** Missing environment variables in Supabase

**Solution:**
```powershell
# Check which mode you're in
echo $IS_PRODUCTION

# If sandbox (false), ensure these are set:
supabase secrets set SB_SERVER_KEY=your_sandbox_server_key
supabase secrets set SB_CLIENT_KEY=your_sandbox_client_key

# If production (true), ensure these are set:
supabase secrets set PROD_SERVER_KEY=your_production_server_key
supabase secrets set PROD_CLIENT_KEY=your_production_client_key
```

### Issue: Wrong environment loading

**Cause:** Cached configuration

**Solution:**
1. Clear browser cache
2. Redeploy Edge Functions
3. Verify `IS_PRODUCTION` value:
   ```powershell
   supabase secrets list
   ```

## Security Notes

### ✅ Safe to Expose (Client-side)
- Client Key (sandbox or production)
- Script URL
- `isProduction` flag

### ❌ Never Expose (Server-side only)
- Server Key (sandbox or production)
- Supabase Service Role Key
- Any other API secrets

The architecture ensures:
- Server keys never leave the backend
- Client keys are provided via secure API
- Frontend only receives necessary data

## Development vs Production

| Aspect | Development | Production |
|--------|-------------|------------|
| IS_PRODUCTION | `false` | `true` |
| Midtrans Dashboard | sandbox.midtrans.com | dashboard.midtrans.com |
| Script URL | app.sandbox.midtrans.com | app.midtrans.com |
| API URL | api.sandbox.midtrans.com | api.midtrans.com |
| Payment | Test cards | Real money |
| Environment Badge | Shows "Sandbox Mode" | Shows "Production Mode" |

## File Structure

```
├── supabase/
│   └── functions/
│       ├── midtrans-payment/
│       │   └── index.ts          # Payment token creation
│       └── midtrans-config/
│           └── index.ts          # Client config API
├── src/
│   ├── hooks/
│   │   └── useMidtrans.ts        # Dynamic script loader
│   └── components/
│       └── CheckoutButton.tsx    # Payment UI
├── config/
│   └── midtrans.js               # Node.js reference (unused)
└── index.html                    # No hardcoded script
```

## Logs and Debugging

### Backend Logs (Supabase)
```powershell
# View function logs
supabase functions logs midtrans-payment --tail
supabase functions logs midtrans-config --tail
```

### Frontend Logs (Browser Console)
- `🔄 Fetching Midtrans configuration...` - Starting config fetch
- `✅ Midtrans config loaded` - Config successfully loaded
- `✅ Midtrans Snap.js loaded successfully` - Script ready
- `🔧 Midtrans Config: {...}` - Backend configuration details

## Next Steps

1. ✅ Deploy Edge Functions
2. ✅ Set environment variables
3. ✅ Test in sandbox mode
4. ⏳ Integrate webhook handler (already exists: `midtrans-webhook`)
5. ⏳ Test production mode with small amount
6. ⏳ Monitor transactions in Midtrans dashboard
7. ⏳ Set up automated testing

## Support

- **Midtrans Documentation:** https://docs.midtrans.com/
- **Supabase Edge Functions:** https://supabase.com/docs/guides/functions
- **Project Issues:** Create issue in repository

---

**Last Updated:** 2025-01-14
**Version:** 2.0 (Dynamic Configuration)
