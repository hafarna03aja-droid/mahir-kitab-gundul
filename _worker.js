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
// EMAIL HELPER FUNCTIONS (MailChannels)
// ========================================

// Send email via MailChannels API (free 100 emails/day)
async function sendEmail({ to, subject, htmlContent, fromName = 'Mahir Arab' }) {
  try {
    const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: 'admin@mahirarab.web.id', name: fromName },
        subject: subject,
        content: [{ type: 'text/html', value: htmlContent }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Email send failed:', error);
      return false;
    }

    console.log('✅ Email sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
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
        const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL || 'https://viywfnjhpnunwhakhnrj.supabase.co';
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
              gross_amount: parseFloat(gross_amount) || 1000,
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

        const updatedOrders = await orderUpdateResponse.json();

        if (!orderUpdateResponse.ok) {
          console.warn('⚠️ Order update failed:', JSON.stringify(updatedOrders));
        } else if (!updatedOrders || updatedOrders.length === 0) {
          // Order doesn't exist, create new one
          console.log('📝 Order not found, creating new one...');
          const createResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'apikey': SUPABASE_SERVICE_KEY,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              order_id: order_id,
              email: email,
              gross_amount: parseFloat(gross_amount) || 1000,
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
            const err = await createResponse.text();
            console.warn('⚠️ Order create failed:', err);
          } else {
            console.log('✅ New order created');
          }
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

        // ✅ STEP 5: Send confirmation email
        console.log('📧 Sending confirmation email to:', email);

        const emailAmount = parseFloat(gross_amount) || 0;
        const confirmationEmailSent = await sendEmail({
          to: email,
          subject: '🎉 Pembayaran Berhasil - Mahir Arab Gundul',
          htmlContent: getPaymentConfirmationEmail(order_id, email, emailAmount)
        });

        // Also send welcome email
        const welcomeEmailSent = await sendEmail({
          to: email,
          subject: '🌟 Selamat Datang di Mahir Arab Gundul!',
          htmlContent: getWelcomeEmail(email)
        });

        console.log('📧 Emails sent:', { confirmation: confirmationEmailSent, welcome: welcomeEmailSent });

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

        // Validate input
        if (!email || !email.includes('@')) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Email tidak valid'
          }), { status: 400, headers: corsHeaders });
        }

        if (!amount || amount <= 0) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Amount tidak valid'
          }), { status: 400, headers: corsHeaders });
        }

        // Get environment variables
        const MIDTRANS_SERVER_KEY = env.MIDTRANS_SERVER_KEY;
        const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL || 'https://viywfnjhpnunwhakhnrj.supabase.co';
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

        const testEmailSent = await sendEmail({
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
          `
        });

        return new Response(JSON.stringify({
          success: testEmailSent,
          message: testEmailSent ? 'Test email terkirim!' : 'Gagal mengirim email',
          email: email
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
