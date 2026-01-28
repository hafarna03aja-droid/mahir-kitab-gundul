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

// ========================================
// EMAIL HELPER FUNCTIONS (Resend API)
// Free: 3,000 emails/month
// ========================================

// Send email via Resend API
async function sendEmail({ to, subject, htmlContent, fromName = 'Mahir Arab', env }) {
  try {
    const RESEND_API_KEY = env?.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not configured!');
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }

    console.log('📧 Sending email via Resend to:', to);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `${fromName} <admin@mahirarab.web.id>`,
        to: to,
        subject: subject,
        html: htmlContent
      })
    });

    const responseData = await response.json();
    console.log('📧 Resend response:', response.status, JSON.stringify(responseData));

    if (!response.ok) {
      console.error('❌ Email send failed:', response.status, responseData);
      return { success: false, error: responseData.message || 'Failed to send', status: response.status };
    }

    console.log('✅ Email sent successfully to:', to, 'ID:', responseData.id);
    return { success: true, id: responseData.id };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { success: false, error: error.message };
  }
}

// Send email with retry logic (3 attempts with exponential backoff)
async function sendEmailWithRetry({ to, subject, htmlContent, fromName, env, maxRetries = 3 }) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`📧 Email attempt ${attempt}/${maxRetries} to ${to}`);

    const result = await sendEmail({ to, subject, htmlContent, fromName, env });

    if (result.success) {
      if (attempt > 1) {
        console.log(`✅ Email sent successfully on attempt ${attempt}`);
      }
      return result;
    }

    // If this was the last attempt, return the failure
    if (attempt === maxRetries) {
      console.error(`❌ Email failed after ${maxRetries} attempts:`, result.error);
      return result;
    }

    // Exponential backoff: 1s, 2s, 4s
    const delayMs = Math.pow(2, attempt - 1) * 1000;
    console.log(`⏳ Retrying in ${delayMs / 1000}s...`);
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
}

// Payment confirmation email template
function getPaymentConfirmationEmail(orderId, email, amount) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;">
    <tr>
      <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 30px;text-align:center;">
        <h1 style="color:#ffffff;margin:0;font-size:28px;">🎉 Pembayaran Berhasil!</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:40px 30px;">
        <p style="font-size:16px;color:#333;margin-bottom:20px;">Assalamu'alaikum,</p>
        <p style="font-size:16px;color:#333;margin-bottom:20px;">
          Terima kasih telah berlangganan <strong>Mahir Arab Gundul</strong>! Pembayaran Anda telah kami terima.
        </p>
        
        <div style="background-color:#f8f9fa;border-radius:10px;padding:20px;margin:20px 0;">
          <table width="100%" cellpadding="5">
            <tr>
              <td style="color:#666;font-size:14px;">Order ID:</td>
              <td style="color:#333;font-size:14px;font-weight:bold;">${orderId}</td>
            </tr>
            <tr>
              <td style="color:#666;font-size:14px;">Email:</td>
              <td style="color:#333;font-size:14px;">${email}</td>
            </tr>
            <tr>
              <td style="color:#666;font-size:14px;">Jumlah:</td>
              <td style="color:#333;font-size:14px;font-weight:bold;">Rp ${amount?.toLocaleString('id-ID') || '-'}</td>
            </tr>
            <tr>
              <td style="color:#666;font-size:14px;">Status:</td>
              <td style="color:#28a745;font-size:14px;font-weight:bold;">✅ Premium Aktif</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size:16px;color:#333;margin-bottom:30px;">
          Akses premium Anda sudah aktif! Silakan login untuk mulai belajar.
        </p>
        
        <div style="text-align:center;">
          <a href="https://mahirarab.web.id/app" 
             style="display:inline-block;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#ffffff;text-decoration:none;padding:15px 40px;border-radius:30px;font-size:16px;font-weight:bold;">
            🚀 Masuk ke Aplikasi
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="background-color:#f8f9fa;padding:20px 30px;text-align:center;">
        <p style="color:#666;font-size:12px;margin:0;">
          © 2025 Mahir Arab Gundul | <a href="https://mahirarab.web.id" style="color:#667eea;">mahirarab.web.id</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Welcome email template for new users
function getWelcomeEmail(email) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;">
    <tr>
      <td style="background:linear-gradient(135deg,#11998e 0%,#38ef7d 100%);padding:40px 30px;text-align:center;">
        <h1 style="color:#ffffff;margin:0;font-size:28px;">🌟 Selamat Datang!</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:40px 30px;">
        <p style="font-size:16px;color:#333;margin-bottom:20px;">Assalamu'alaikum,</p>
        <p style="font-size:16px;color:#333;margin-bottom:20px;">
          Selamat bergabung dengan <strong>Mahir Arab Gundul</strong>! 🎊
        </p>
        <p style="font-size:16px;color:#333;margin-bottom:20px;">
          Anda sekarang memiliki akses ke semua fitur premium untuk belajar membaca kitab gundul dengan mudah.
        </p>
        
        <div style="background-color:#e8f5e9;border-left:4px solid #4caf50;padding:15px;margin:20px 0;">
          <p style="margin:0;color:#2e7d32;font-size:14px;">
            <strong>💡 Tips:</strong> Mulailah dengan latihan dasar untuk memahami pola-pola huruf Arab tanpa harakat.
          </p>
        </div>
        
        <div style="text-align:center;margin-top:30px;">
          <a href="https://mahirarab.web.id/app" 
             style="display:inline-block;background:linear-gradient(135deg,#11998e 0%,#38ef7d 100%);color:#ffffff;text-decoration:none;padding:15px 40px;border-radius:30px;font-size:16px;font-weight:bold;">
            📚 Mulai Belajar Sekarang
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="background-color:#f8f9fa;padding:20px 30px;text-align:center;">
        <p style="color:#666;font-size:12px;margin:0;">
          © 2025 Mahir Arab Gundul | <a href="https://mahirarab.web.id" style="color:#11998e;">mahirarab.web.id</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// CORS Headers - Restricted to production domain
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://mahirarab.web.id',
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
    // AI CHAT WITH KV CACHE
    // URL: https://mahirarab.web.id/api/chat
    // Caches AI responses in Cloudflare KV for 30 days
    // ========================================
    if (pathname === '/api/chat' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { prompt, userApiKey, systemInstruction, jsonMode } = body;

        // Validation
        if (!prompt || prompt.trim() === '') {
          return new Response(JSON.stringify({
            error: 'Prompt is required',
            message: 'Please provide a valid prompt'
          }), { status: 400, headers: corsHeaders });
        }

        // ========================================
        // RATE LIMITING (100 requests/day/user)
        // ========================================
        const authHeader = request.headers.get('Authorization');
        let userId = null;

        // Only apply rate limiting if Authorization header is present
        if (authHeader && authHeader.startsWith('Bearer ')) {
          try {
            const token = authHeader.replace('Bearer ', '');
            const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
            const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;

            if (SUPABASE_URL && SUPABASE_ANON_KEY) {
              // Verify user via Supabase Auth
              const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
                headers: {
                  'Authorization': authHeader,
                  'apikey': SUPABASE_ANON_KEY
                }
              });

              if (authResponse.ok) {
                const { id: verifiedUserId } = await authResponse.json();
                userId = verifiedUserId;

                // Check rate limit
                const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD in UTC

                // Fetch user's usage data
                const profileResponse = await fetch(
                  `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=daily_usage_count,last_usage_date`,
                  {
                    headers: {
                      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                      'apikey': SUPABASE_ANON_KEY
                    }
                  }
                );

                if (profileResponse.ok) {
                  const profiles = await profileResponse.json();

                  if (profiles && profiles.length > 0) {
                    const profile = profiles[0];
                    let currentCount = profile?.daily_usage_count || 0;
                    const lastUsageDate = profile?.last_usage_date;

                    // RESET LOGIC: If last usage date != today, reset counter
                    if (lastUsageDate !== today) {
                      await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                          'apikey': SUPABASE_ANON_KEY
                        },
                        body: JSON.stringify({
                          daily_usage_count: 0,
                          last_usage_date: today
                        })
                      });
                      currentCount = 0;
                      console.log('🔄 Daily usage counter reset for user:', userId);
                    }

                    // CHECK LOGIC: If count >= 100, deny access
                    if (currentCount >= 100) {
                      console.log('🚫 Rate limit exceeded for user:', userId, 'count:', currentCount);
                      return new Response(JSON.stringify({
                        error: 'Kuota harian habis. Silakan coba lagi besok.',
                        code: 'RATE_LIMIT_EXCEEDED',
                        remaining: 0,
                        resetDate: new Date(today + 'T00:00:00Z').toISOString()
                      }), { status: 429, headers: corsHeaders });
                    }

                    console.log('✅ Rate limit OK for user:', userId, 'usage:', currentCount, '/100');
                  }
                }
              }
            }
          } catch (rateLimitError) {
            // If rate limiting check fails, log but continue
            // This ensures the API still works even if Supabase is down
            console.warn('⚠️ Rate limit check failed, allowing request:', rateLimitError.message);
          }
        }
        // ========================================
        // END RATE LIMITING
        // ========================================

        // Build full prompt with system instruction if provided
        const fullPrompt = systemInstruction
          ? `${systemInstruction}\n\nUser: ${prompt}`
          : prompt;

        // Create cache key (hash of full prompt for consistency)
        const cacheKey = fullPrompt.substring(0, 500); // Limit key length

        // Priority 1: Check KV Cache (only for app key, not user key)
        if (!userApiKey && env.AI_CACHE) {
          try {
            const cachedResponse = await env.AI_CACHE.get(cacheKey);
            if (cachedResponse) {
              console.log('✅ Cache HIT:', prompt.substring(0, 50));
              return new Response(JSON.stringify({
                text: cachedResponse,
                source: 'cache_kv'
              }), { status: 200, headers: corsHeaders });
            }
            console.log('❌ Cache MISS:', prompt.substring(0, 50));
          } catch (kvError) {
            console.warn('⚠️ KV read error:', kvError.message);
          }
        }

        // Priority 2: Determine API Key
        let activeApiKey;
        let source;

        if (userApiKey && userApiKey.trim().length > 0) {
          activeApiKey = userApiKey.trim();
          source = 'api_user';
          console.log('🔑 Using USER API Key');
        } else {
          // Try multiple env variable names for compatibility
          const serverApiKey = env.GOOGLE_API_KEY || env.VITE_GEMINI_API_KEY;
          if (!serverApiKey) {
            return new Response(JSON.stringify({
              error: 'API Key not configured',
              message: 'Server API key is not set. Please provide your own API key or configure GOOGLE_API_KEY in environment.'
            }), { status: 500, headers: corsHeaders });
          }
          activeApiKey = serverApiKey;
          source = 'api_app';
          console.log('🔑 Using APP API Key');
        }


        // Build Gemini request
        const geminiPayload = {
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.3,
          }
        };

        // Add JSON mode if requested
        if (jsonMode) {
          geminiPayload.generationConfig.responseMimeType = 'application/json';
        }

        // Call Gemini API
        console.log('🤖 Calling Gemini API...');
        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${activeApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(geminiPayload)
          }
        );

        const geminiData = await geminiResponse.json();

        if (!geminiResponse.ok) {
          const errorMsg = geminiData.error?.message || 'Gemini API error';
          console.error('❌ Gemini Error:', errorMsg);

          // Handle specific errors
          let statusCode = 500;
          if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('invalid')) {
            statusCode = 401;
          } else if (errorMsg.includes('quota') || errorMsg.includes('limit')) {
            statusCode = 429;
          }

          return new Response(JSON.stringify({
            error: errorMsg,
            source: source
          }), { status: statusCode, headers: corsHeaders });
        }

        const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
          return new Response(JSON.stringify({
            error: 'Empty response from AI',
            source: source
          }), { status: 500, headers: corsHeaders });
        }

        // Save to KV Cache (only for app key, not user key)
        if (!userApiKey && env.AI_CACHE) {
          try {
            const TTL_30_DAYS = 60 * 60 * 24 * 30; // 30 days in seconds
            await env.AI_CACHE.put(cacheKey, text, { expirationTtl: TTL_30_DAYS });
            console.log('💾 Saved to KV cache');
          } catch (kvError) {
            console.warn('⚠️ KV write error:', kvError.message);
          }
        }

        // ========================================
        // INCREMENT USAGE COUNTER
        // ========================================
        if (userId) {
          try {
            const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
            const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;
            const today = new Date().toISOString().split('T')[0];

            // Fetch current count
            const profileResponse = await fetch(
              `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=daily_usage_count`,
              {
                headers: {
                  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                  'apikey': SUPABASE_ANON_KEY
                }
              }
            );

            if (profileResponse.ok) {
              const profiles = await profileResponse.json();
              if (profiles && profiles.length > 0) {
                const currentCount = profiles[0]?.daily_usage_count || 0;

                // Update with incremented value
                await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'apikey': SUPABASE_ANON_KEY
                  },
                  body: JSON.stringify({
                    daily_usage_count: currentCount + 1,
                    last_usage_date: today
                  })
                });

                console.log('📊 Usage incremented for user:', userId, 'new count:', currentCount + 1);
              }
            }
          } catch (incrementError) {
            // Non-blocking: don't fail the request if increment fails
            console.warn('⚠️ Failed to increment usage counter:', incrementError.message);
          }
        }
        // ========================================
        // END INCREMENT USAGE
        // ========================================

        console.log('✅ Chat response generated, source:', source);

        return new Response(JSON.stringify({
          text: text,
          source: source
        }), { status: 200, headers: corsHeaders });

      } catch (error) {
        console.error('❌ Chat error:', error.message);
        return new Response(JSON.stringify({
          error: error.message || 'Failed to process request',
          details: error.toString()
        }), { status: 500, headers: corsHeaders });
      }
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
        const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
        const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

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

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          console.error('❌ Invalid email format:', email);
          return new Response(JSON.stringify({
            success: false,
            error: 'Invalid email format'
          }), { status: 400, headers: corsHeaders });
        }

        // ✅ STEP 2.5: Idempotency Check - Prevent duplicate processing
        console.log('🔍 Checking if order already processed...');
        try {
          const checkExisting = await fetch(
            `${SUPABASE_URL}/rest/v1/orders?order_id=eq.${encodeURIComponent(order_id)}`,
            {
              headers: {
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'apikey': SUPABASE_SERVICE_KEY
              }
            }
          );

          if (checkExisting.ok) {
            const existingOrders = await checkExisting.json();
            if (existingOrders && existingOrders.length > 0) {
              const existingOrder = existingOrders[0];

              // If already settled/captured, skip processing to prevent duplicate emails
              if (existingOrder.transaction_status === 'settlement' ||
                existingOrder.transaction_status === 'capture') {
                console.log('⏭️ Order already processed as', existingOrder.transaction_status, '- skipping duplicate webhook');

                // Update webhook attempts counter only
                await fetch(
                  `${SUPABASE_URL}/rest/v1/orders?order_id=eq.${encodeURIComponent(order_id)}`,
                  {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                      'apikey': SUPABASE_SERVICE_KEY
                    },
                    body: JSON.stringify({
                      webhook_attempts: (existingOrder.webhook_attempts || 0) + 1,
                      updated_at: new Date().toISOString()
                    })
                  }
                );

                return new Response(JSON.stringify({
                  success: true,
                  message: 'Already processed (idempotent)',
                  order_id: order_id,
                  status: existingOrder.transaction_status,
                  webhook_attempt: (existingOrder.webhook_attempts || 0) + 1
                }), { status: 200, headers: corsHeaders });
              }

              console.log(`📊 Processing webhook attempt #${(existingOrder.webhook_attempts || 0) + 1}`);
            }
          }
        } catch (idempotencyError) {
          // If idempotency check fails, log but continue processing
          // This ensures webhook still works even if check fails
          console.warn('⚠️ Idempotency check failed, continuing anyway:', idempotencyError.message);
        }

        // ✅ STEP 3: Update or Create order in Supabase
        console.log('📝 Updating order:', order_id);

        // First try PATCH (update existing order)
        const orderUpdateResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/orders?order_id=eq.${encodeURIComponent(order_id)}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'apikey': SUPABASE_SERVICE_KEY,
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              email: email,
              gross_amount: parseFloat(gross_amount) || 100,
              transaction_status: transaction_status,
              fraud_status: fraud_status,
              payment_type: payment_type || 'unknown',
              paid_at: transaction_time || new Date().toISOString(),
              midtrans_response: payload,
              updated_at: new Date().toISOString(),
              webhook_attempts: 1
            })
          }
        );

        if (!orderUpdateResponse.ok) {
          const errorText = await orderUpdateResponse.text();
          console.error('❌ Order update failed:', errorText);
          throw new Error('Failed to update order in database');
        }

        const updatedOrders = await orderUpdateResponse.json();

        if (!updatedOrders || updatedOrders.length === 0) {
          // Order doesn't exist, create new one
          console.log('📝 Order not found, creating new one...');
          const createResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'apikey': SUPABASE_SERVICE_KEY,
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              order_id: order_id,
              email: email,
              gross_amount: parseFloat(gross_amount) || 100,
              transaction_status: transaction_status,
              fraud_status: fraud_status,
              payment_type: payment_type || 'unknown',
              paid_at: transaction_time || new Date().toISOString(),
              midtrans_response: payload,
              created_at: new Date().toISOString(),
              webhook_attempts: 1
            })
          });

          if (!createResponse.ok) {
            const errorText = await createResponse.text();
            console.error('❌ Order creation failed:', errorText);
            throw new Error('Failed to create order in database');
          }

          const createdOrder = await createResponse.json();
          if (!createdOrder || createdOrder.length === 0) {
            console.error('❌ Order creation returned empty result');
            throw new Error('Order creation verification failed');
          }

          console.log('✅ New order created:', createdOrder[0]?.order_id);
        } else {
          console.log('✅ Order updated:', updatedOrders[0]?.order_id);
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

        if (!checkProfile.ok) {
          const errorText = await checkProfile.text();
          console.error('❌ Failed to check profile:', errorText);
          throw new Error('Failed to verify profile status');
        }

        const existingProfiles = await checkProfile.json();

        if (existingProfiles && existingProfiles.length > 0) {
          // Update existing profile
          console.log('📝 Updating existing profile to premium...');
          const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'apikey': SUPABASE_SERVICE_KEY,
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              status: 'premium',
              subscription_expires_at: expiryDate.toISOString()
            })
          });

          if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            console.error('❌ Profile update failed:', errorText);
            throw new Error('Failed to update profile to premium status');
          }

          const updatedProfile = await updateResponse.json();
          if (!updatedProfile || updatedProfile.length === 0) {
            console.error('❌ Profile update returned empty result');
            throw new Error('Profile update verification failed');
          }

          console.log('✅ Profile updated to premium:', updatedProfile[0].email);
        } else {
          // Create new profile
          console.log('📝 Creating new premium profile...');
          const createResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'apikey': SUPABASE_SERVICE_KEY,
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              email: email,
              status: 'premium',
              subscription_expires_at: expiryDate.toISOString()
            })
          });

          if (!createResponse.ok) {
            const errorText = await createResponse.text();
            console.error('❌ Profile creation failed:', errorText);
            throw new Error('Failed to create premium profile');
          }

          const createdProfile = await createResponse.json();
          if (!createdProfile || createdProfile.length === 0) {
            console.error('❌ Profile creation returned empty result');
            throw new Error('Profile creation verification failed');
          }

          console.log('✅ New premium profile created:', createdProfile[0].email);
        }

        // ✅ STEP 5: Send confirmation email with retry
        console.log('📧 Sending confirmation email to:', email);

        const emailAmount = parseFloat(gross_amount) || 0;
        const confirmationEmailSent = await sendEmailWithRetry({
          to: email,
          subject: '🎉 Pembayaran Berhasil - Mahir Arab Gundul',
          htmlContent: getPaymentConfirmationEmail(order_id, email, emailAmount),
          env: env
        });

        // Also send welcome email with retry
        const welcomeEmailSent = await sendEmailWithRetry({
          to: email,
          subject: '🌟 Selamat Datang di Mahir Arab Gundul!',
          htmlContent: getWelcomeEmail(email),
          env: env
        });

        console.log('📧 Emails sent:', { confirmation: confirmationEmailSent.success, welcome: welcomeEmailSent.success });

        // Log email failures for monitoring (but don't fail webhook)
        if (!confirmationEmailSent.success) {
          console.error('⚠️ Confirmation email failed after retries:', confirmationEmailSent.error);
        }
        if (!welcomeEmailSent.success) {
          console.error('⚠️ Welcome email failed after retries:', welcomeEmailSent.error);
        }

        console.log('🎉 Webhook processed successfully!');

        return new Response(JSON.stringify({
          success: true,
          message: 'Payment processed',
          email: email,
          order_id: order_id,
          emails_sent: { confirmation: confirmationEmailSent, welcome: welcomeEmailSent }
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
    // PAYMENT API ENDPOINT
    // URL: https://mahirarab.web.id/api/payment
    // Creates Midtrans Snap token for payment
    // ========================================
    if (pathname === '/api/payment' && request.method === 'POST') {
      try {
        const { email, amount, item_name } = await request.json();

        console.log('💳 Payment Request:', { email, amount, item_name });

        // Validate email format with regex (consistent with webhook validation)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Email tidak boleh kosong'
          }), { status: 400, headers: corsHeaders });
        }

        if (!emailRegex.test(email)) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Format email tidak valid'
          }), { status: 400, headers: corsHeaders });
        }

        // Validate amount
        if (!amount || amount <= 0) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Amount tidak valid'
          }), { status: 400, headers: corsHeaders });
        }

        // Get environment variables
        const MIDTRANS_SERVER_KEY = env.MIDTRANS_SERVER_KEY;
        const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
        const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;

        if (!MIDTRANS_SERVER_KEY) {
          console.error('❌ MIDTRANS_SERVER_KEY not configured!');
          return new Response(JSON.stringify({
            success: false,
            error: 'Server configuration error'
          }), { status: 500, headers: corsHeaders });
        }

        // Generate unique order ID
        const orderId = `MAG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Create Midtrans transaction
        const transactionData = {
          transaction_details: {
            order_id: orderId,
            gross_amount: amount
          },
          item_details: [{
            id: 'MAG-LIFETIME',
            price: amount,
            quantity: 1,
            name: item_name || 'Mahir Arab Gundul - Lifetime Access'
          }],
          customer_details: {
            email: email,
            first_name: email.split('@')[0]
          },
          callbacks: {
            finish: 'https://mahirarab.web.id/app?payment=success'
          }
        };

        // Call Midtrans API
        const midtransAuth = 'Basic ' + btoa(MIDTRANS_SERVER_KEY + ':');
        const midtransResponse = await fetch('https://app.midtrans.com/snap/v1/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': midtransAuth
          },
          body: JSON.stringify(transactionData)
        });

        const midtransData = await midtransResponse.json();

        if (!midtransResponse.ok) {
          console.error('❌ Midtrans Error:', midtransData);
          return new Response(JSON.stringify({
            success: false,
            error: midtransData.error_messages?.[0] || 'Gagal membuat transaksi'
          }), { status: 500, headers: corsHeaders });
        }

        console.log('✅ Snap token created:', orderId);

        // Save order to Supabase
        if (SUPABASE_SERVICE_KEY) {
          try {
            await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'apikey': SUPABASE_SERVICE_KEY,
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify({
                order_id: orderId,
                email: email,
                gross_amount: amount,
                transaction_status: 'pending',
                snap_token: midtransData.token,
                created_at: new Date().toISOString()
              })
            });
            console.log('✅ Order saved to database');
          } catch (dbError) {
            console.warn('⚠️ Failed to save order:', dbError.message);
          }
        }

        return new Response(JSON.stringify({
          success: true,
          snap_token: midtransData.token,
          redirect_url: midtransData.redirect_url,
          order_id: orderId
        }), { status: 200, headers: corsHeaders });

      } catch (error) {
        console.error('❌ Payment error:', error.message);
        return new Response(JSON.stringify({
          success: false,
          error: error.message || 'Gagal memproses pembayaran'
        }), { status: 500, headers: corsHeaders });
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
        has_supabase_url: envKeys.includes('SUPABASE_URL') || envKeys.includes('VITE_SUPABASE_URL'),
        has_supabase_service_key: envKeys.includes('SUPABASE_SERVICE_ROLE_KEY'),
        has_vite_supabase_anon_key: envKeys.includes('VITE_SUPABASE_ANON_KEY'),
        config_status: {
          midtrans: !!env.MIDTRANS_SERVER_KEY ? '✅ OK' : '❌ MISSING',
          supabase_url: (env.SUPABASE_URL || env.VITE_SUPABASE_URL) ? '✅ OK' : '⚠️ Using fallback',
          supabase_key: (env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY) ? '✅ OK' : '❌ MISSING'
        },
        env_type: typeof env,
        note: 'Values are hidden for security'
      }), { status: 200, headers: corsHeaders });
    }

    // ========================================
    // TEST EMAIL ENDPOINT
    // URL: POST https://mahirarab.web.id/api/test-email
    // Body: { "email": "your@email.com" }
    // ========================================
    if (pathname === '/api/test-email' && request.method === 'POST') {
      try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Email tidak valid'
          }), { status: 400, headers: corsHeaders });
        }

        console.log('📧 Testing email to:', email);

        const testEmailResult = await sendEmail({
          to: email,
          subject: '✅ Test Email - Mahir Arab Gundul',
          htmlContent: `
            <div style="font-family:Arial,sans-serif;padding:20px;max-width:500px;margin:0 auto;">
              <h2 style="color:#667eea;">🎉 Email Test Berhasil!</h2>
              <p>Jika Anda menerima email ini, berarti sistem email Mahir Arab sudah berfungsi dengan baik.</p>
              <p><strong>Waktu:</strong> ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</p>
              <hr style="border:1px solid #eee;margin:20px 0;">
              <p style="color:#666;font-size:12px;">Email ini dikirim dari mahirarab.web.id</p>
            </div>
          `,
          env: env
        });

        return new Response(JSON.stringify({
          success: testEmailResult.success,
          message: testEmailResult.success ? 'Test email terkirim!' : 'Gagal mengirim email',
          email: email,
          error: testEmailResult.error || null
        }), { status: 200, headers: corsHeaders });

      } catch (error) {
        console.error('❌ Test email error:', error.message);
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), { status: 500, headers: corsHeaders });
      }
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
