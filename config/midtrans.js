require('dotenv').config();

const isProduction = process.env.IS_PRODUCTION === 'true';

module.exports = {
    isProduction,
    serverKey: isProduction ? process.env.PROD_SERVER_KEY : process.env.SB_SERVER_KEY,
    clientKey: isProduction ? process.env.PROD_CLIENT_KEY : process.env.SB_CLIENT_KEY,
    apiUrl: isProduction 
        ? 'https://app.midtrans.com/snap/snap.js' 
        : 'https://app.sandbox.midtrans.com/snap/snap.js'
};
