export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // ========================================
    // MIDTRANS WEBHOOK PROXY
    // Receives webhooks from Midtrans (no auth)
    // Forwards to Supabase with Authorization header
    // ========================================
    if (pathname === '/webhook/midtrans' && request.method === 'POST') {
      try {
        // Get webhook payload from Midtrans
        const payload = await request.json();
        
        console.log('📥 Midtrans webhook received:', {
          order_id: payload.order_id,
          transaction_status: payload.transaction_status,
          email: payload.customer_details?.email
        });
        
        // Supabase configuration
        const supabaseUrl = 'https://viywfnjhpnunwhakhnrj.supabase.co/functions/v1/midtrans-webhook';
        const anonKey = env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpeXdmbmpocG51bndoYWtobnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxOTgzMTMsImV4cCI6MjA3OTc3NDMxM30._Zj2FGSI7BnZBt6mUvOoJMZXXcUXSLijjPjiNYrTjQo';
        
        // Forward to Supabase with auth headers
        const response = await fetch(supabaseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`,
            'apikey': anonKey
          },
          body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        
        if (response.ok) {
          console.log('✅ Webhook forwarded successfully:', result);
          // Return 200 to Midtrans
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } else {
          console.error('❌ Supabase webhook error:', result);
          // Still return 200 to Midtrans to prevent retry spam
          return new Response(JSON.stringify({ success: false, error: result }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } catch (error) {
        console.error('❌ Webhook proxy error:', error.message);
        // Return 200 to prevent Midtrans retry spam
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
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
