require('dotenv').config();

// Midtrans Configuration - PRODUCTION MODE ONLY
// Sandbox mode has been removed, always use production
module.exports = {
    isProduction: true,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
    apiUrl: 'https://app.midtrans.com/snap/snap.js'
};
