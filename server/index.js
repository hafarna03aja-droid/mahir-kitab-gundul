require('dotenv').config();
const express = require('express');
const compression = require('compression');
const midtransClient = require('midtrans-client');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// Gzip Compression - Optimize response size
// ============================================
app.use(compression());

// ============================================
// CORS Middleware - Handle CORS for all requests
// ============================================
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, Pragma');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Parse JSON body
app.use(express.json());

// ============================================
// Midtrans Configuration
// ============================================
const snap = new midtransClient.Snap({
    isProduction: true,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY || process.env.VITE_MIDTRANS_CLIENT_KEY
});

// Debug: Check configuration
console.log('🔧 Midtrans Config:', {
    isProduction: true,
    hasServerKey: !!process.env.MIDTRANS_SERVER_KEY,
    serverKeyLength: process.env.MIDTRANS_SERVER_KEY ? process.env.MIDTRANS_SERVER_KEY.length : 0,
    clientKey: process.env.MIDTRANS_CLIENT_KEY || process.env.VITE_MIDTRANS_CLIENT_KEY
});

// ============================================
// Supabase Configuration
// ============================================
const supabase = createClient(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// ============================================
// Health Check Endpoint
// ============================================
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: 'production'
    });
});

// ============================================
// Payment API Endpoint
// ============================================
app.post('/api/payment', async (req, res) => {
    try {
        const { email, amount, item_name } = req.body;

        // Validate input
        if (!email || !email.includes('@')) {
            return res.status(400).json({
                success: false,
                error: 'Email tidak valid'
            });
        }

        // Validate amount is required and positive
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Amount tidak valid'
            });
        }

        // Generate unique order ID
        const orderId = `MAG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Create Midtrans transaction
        const parameter = {
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
                finish: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/app?payment=success`
            }
        };

        console.log('📦 Creating Midtrans transaction:', { orderId, email, amount });

        const transaction = await snap.createTransaction(parameter);

        console.log('✅ Transaction created:', {
            orderId,
            token: transaction.token ? '***exists***' : 'missing'
        });

        // Save order to database
        try {
            const { error: dbError } = await supabase
                .from('orders')
                .insert({
                    order_id: orderId,
                    email: email,
                    gross_amount: amount,
                    transaction_status: 'pending',
                    snap_token: transaction.token,
                    created_at: new Date().toISOString()
                });

            if (dbError) {
                console.warn('⚠️ Failed to save order to DB:', dbError.message);
            }
        } catch (dbErr) {
            console.warn('⚠️ Database error:', dbErr.message);
        }

        // Return success response
        res.json({
            success: true,
            snap_token: transaction.token,
            redirect_url: transaction.redirect_url,
            order_id: orderId
        });

    } catch (error) {
        console.error('❌ Payment error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Gagal membuat transaksi'
        });
    }
});

// ============================================
// Webhook Endpoint (for Midtrans callbacks)
// ============================================
app.post('/api/webhook', async (req, res) => {
    try {
        const {
            order_id,
            transaction_status,
            fraud_status,
            customer_details
        } = req.body;

        console.log('🔔 Webhook received:', { order_id, transaction_status, fraud_status });

        // Validate required fields
        if (!order_id) {
            return res.status(400).json({
                success: false,
                error: 'Missing order_id'
            });
        }

        // Determine if payment is successful
        const isSuccess =
            (transaction_status === 'capture' && fraud_status === 'accept') ||
            transaction_status === 'settlement';

        if (isSuccess) {
            console.log('✅ Payment successful for:', order_id);

            // Update order status in database
            const { error: updateError } = await supabase
                .from('orders')
                .update({
                    transaction_status: 'settlement',
                    paid_at: new Date().toISOString()
                })
                .eq('order_id', order_id);

            if (updateError) {
                console.warn('⚠️ Failed to update order:', updateError.message);
            }

            // Get email from order or customer_details
            let userEmail = customer_details?.email;

            if (!userEmail) {
                const { data: orderData } = await supabase
                    .from('orders')
                    .select('email')
                    .eq('order_id', order_id)
                    .single();

                userEmail = orderData?.email;
            }

            if (userEmail) {
                // Calculate subscription expiry (30 days from now)
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 30);

                // Create or update profile with premium access
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        email: userEmail,
                        status: 'premium',
                        subscription_expires_at: expiryDate.toISOString()
                    }, { onConflict: 'email' });

                if (profileError) {
                    console.warn('⚠️ Failed to update profile:', profileError.message);
                } else {
                    console.log('✅ Profile premium status updated:', userEmail);
                }
            }
        } else if (transaction_status === 'pending') {
            console.log('⏳ Payment pending for:', order_id);

            await supabase
                .from('orders')
                .update({ transaction_status: 'pending' })
                .eq('order_id', order_id);

        } else if (['deny', 'cancel', 'expire', 'failure'].includes(transaction_status)) {
            console.log('❌ Payment failed for:', order_id);

            await supabase
                .from('orders')
                .update({ transaction_status: 'failure' })
                .eq('order_id', order_id);
        }

        res.json({ success: true, message: 'Webhook processed' });

    } catch (error) {
        console.error('❌ Webhook error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Webhook processing failed'
        });
    }
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, '0.0.0.0', () => {
    // Get local network IP dynamically
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    let localIP = 'localhost';

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                localIP = net.address;
                break;
            }
        }
    }

    console.log(`
🚀 Backend Server Running!
━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Local:   http://localhost:${PORT}
📍 Network: http://${localIP}:${PORT}
📡 Endpoints:
   - GET  /api/health   → Health check
   - POST /api/payment  → Create payment
   - POST /api/webhook  → Midtrans webhook
━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
});
