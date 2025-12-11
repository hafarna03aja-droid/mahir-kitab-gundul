// ========================================
// MIDTRANS PRODUCTION WEBHOOK HANDLER
// For domain: mahirarab.web.id
// ========================================

// Helper: Generate SHA-512 signature for Midtrans verification
async function generateSignature(orderId, statusCode, grossAmount, serverKey) {
  const data = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-512', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    // ========================================
    // PUBLIC MIDTRANS WEBHOOK ENDPOINT
    // URL: https://mahirarab.web.id/api/webhook
    // Register this URL in Midtrans Dashboard
    // ========================================
    if ((pathname === '/api/webhook' || pathname === '/webhook/midtrans') && request.method === 'POST') {
      try {
        const payload = await request.json();

        console.log('📥 Midtrans Webhook Received:', {
          order_id: payload.order_id,
          transaction_status: payload.transaction_status,
          fraud_status: payload.fraud_status,
          email: payload.customer_details?.email
        });

        // Get environment variables (MUST be set in Cloudflare Pages)
        const MIDTRANS_SERVER_KEY = env.MIDTRANS_SERVER_KEY;
        const SUPABASE_URL = env.SUPABASE_URL || 'https://viywfnjhpnunwhakhnrj.supabase.co';
        const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;

        if (!MIDTRANS_SERVER_KEY) {
          console.error('❌ MIDTRANS_SERVER_KEY not configured!');
          return new Response(JSON.stringify({
            success: false,
            error: 'Server configuration error: Missing MIDTRANS_SERVER_KEY'
          }), { status: 500, headers: corsHeaders });
        }

        // Extract payload data
        const {
          order_id,
          transaction_status,
          fraud_status,
          customer_details,
          signature_key,
          status_code,
          gross_amount,
          payment_type,
          transaction_time
        } = payload;

        // ✅ STEP 1: Verify Midtrans Signature (Security)
        if (signature_key && MIDTRANS_SERVER_KEY) {
          const expectedSignature = await generateSignature(
            order_id,
            status_code,
            gross_amount,
            MIDTRANS_SERVER_KEY
          );

          if (signature_key !== expectedSignature) {
            console.error('❌ INVALID SIGNATURE - Possible fraud!');
            return new Response(JSON.stringify({
              success: false,
              error: 'Invalid signature'
            }), { status: 401, headers: corsHeaders });
          }
          console.log('✅ Signature verified');
        }

        // ✅ STEP 2: Check if payment is successful
        const isSuccess = (
          transaction_status === 'capture' ||
          transaction_status === 'settlement'
        ) && fraud_status === 'accept';

        const email = customer_details?.email;

        if (!isSuccess) {
          console.log('⏳ Payment not successful yet:', transaction_status);
          return new Response(JSON.stringify({
            success: true,
            message: 'Payment status recorded',
            transaction_status
          }), { status: 200, headers: corsHeaders });
        }

        if (!email) {
          console.error('❌ No email in payload');
          return new Response(JSON.stringify({
            success: false,
            error: 'Email required'
          }), { status: 400, headers: corsHeaders });
        }

        // ✅ STEP 3: Update order in Supabase via REST API
        console.log('📝 Updating order:', order_id);

        const orderUpdateResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders?order_id=eq.${order_id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'apikey': SUPABASE_SERVICE_KEY,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            transaction_status: transaction_status,
            fraud_status: fraud_status,
            payment_type: payment_type,
            paid_at: transaction_time || new Date().toISOString(),
            midtrans_response: payload
          })
        });

        if (!orderUpdateResponse.ok) {
          console.warn('⚠️ Order update failed:', await orderUpdateResponse.text());
        } else {
          console.log('✅ Order updated');
        }

        // ✅ STEP 4: Update/Create user profile with premium status
        console.log('📝 Updating profile for:', email);

        // Calculate subscription expiry (30 days)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        // Check if profile exists
        const checkProfile = await fetch(`${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}`, {
          headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'apikey': SUPABASE_SERVICE_KEY
          }
        });

        const existingProfiles = await checkProfile.json();

        if (existingProfiles && existingProfiles.length > 0) {
          // Update existing profile
          await fetch(`${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'apikey': SUPABASE_SERVICE_KEY
            },
            body: JSON.stringify({
              status: 'premium',
              subscription_expires_at: expiryDate.toISOString()
            })
          });
          console.log('✅ Profile updated to premium');
        } else {
          // Create new profile
          await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'apikey': SUPABASE_SERVICE_KEY
            },
            body: JSON.stringify({
              email: email,
              status: 'premium',
              subscription_expires_at: expiryDate.toISOString()
            })
          });
          console.log('✅ New premium profile created');
        }

        console.log('🎉 Webhook processed successfully!');

        return new Response(JSON.stringify({
          success: true,
          message: 'Payment processed',
          email: email,
          order_id: order_id
        }), { status: 200, headers: corsHeaders });

      } catch (error) {
        console.error('❌ Webhook error:', error.message);
        // Always return 200 to prevent Midtrans retry spam
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), { status: 200, headers: corsHeaders });
      }
    }

    // ========================================
    // DEBUG: Check available environment variables
    // ========================================
    if (pathname === '/api/debug-env' && request.method === 'GET') {
      const envKeys = Object.keys(env || {});
      return new Response(JSON.stringify({
        available_keys: envKeys,
        has_midtrans_key: envKeys.includes('MIDTRANS_SERVER_KEY'),
        has_supabase_url: envKeys.includes('SUPABASE_URL'),
        has_supabase_service_key: envKeys.includes('SUPABASE_SERVICE_ROLE_KEY'),
        has_supabase_anon_key: envKeys.includes('SUPABASE_ANON_KEY'),
        env_type: typeof env,
        note: 'Values are hidden for security'
      }), { status: 200, headers: corsHeaders });
    }

    // ========================================
    // HEALTH CHECK ENDPOINT
    // ========================================
    if (pathname === '/api/health' && request.method === 'GET') {
      return new Response(JSON.stringify({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: 'production'
      }), { status: 200, headers: corsHeaders });
    }

    // ========================================
    // SPA ROUTING
    // ========================================

    // Handle /app and /app/ - serve app/index.html
    if (pathname === '/app' || pathname === '/app/') {
      return env.ASSETS.fetch(new URL('/app/index.html', url.origin));
    }

    // Handle /app/* routes for SPA
    if (pathname.startsWith('/app/')) {
      // Let assets pass through
      if (pathname.match(/\.(js|css|svg|png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot|json|html)$/)) {
        return env.ASSETS.fetch(request);
      }
      // Otherwise serve app/index.html
      return env.ASSETS.fetch(new URL('/app/index.html', url.origin));
    }

    // Default: fetch from assets
    return env.ASSETS.fetch(request);
  },
};
