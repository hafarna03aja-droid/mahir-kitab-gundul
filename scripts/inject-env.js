// Script untuk inject environment variables ke HTML file saat build
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path ke dist/index.html
const htmlPath = join(__dirname, '..', 'dist', 'index.html');

try {
    // Read HTML file
    let html = readFileSync(htmlPath, 'utf-8');
    
    // Get environment variables
    const MIDTRANS_CLIENT_KEY = process.env.VITE_MIDTRANS_CLIENT_KEY || 'PLACEHOLDER';
    
    // Replace placeholder with actual values
    html = html.replace('MIDTRANS_CLIENT_KEY_PLACEHOLDER', MIDTRANS_CLIENT_KEY);
    
    // Write back to file
    writeFileSync(htmlPath, html, 'utf-8');
    
    console.log('✅ Environment variables injected successfully');
    console.log('   MIDTRANS_CLIENT_KEY:', MIDTRANS_CLIENT_KEY.substring(0, 15) + '...');
} catch (error) {
    console.error('❌ Error injecting environment variables:', error.message);
    process.exit(1);
}
