// Script untuk inject environment variables ke HTML file saat build
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

// Load .env file
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path ke dist/index.html
const htmlPath = join(__dirname, '..', 'dist', 'index.html');

try {
    // Read HTML file
    let html = readFileSync(htmlPath, 'utf-8');
    
    // Get environment variables from .env file
    const MIDTRANS_CLIENT_KEY = process.env.VITE_MIDTRANS_CLIENT_KEY || 'PLACEHOLDER';
    const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'PLACEHOLDER';
    
    // Replace placeholders with actual values
    html = html.replace('MIDTRANS_CLIENT_KEY_PLACEHOLDER', MIDTRANS_CLIENT_KEY);
    html = html.replace('SUPABASE_ANON_KEY_PLACEHOLDER', SUPABASE_ANON_KEY);
    
    // Write back to file
    writeFileSync(htmlPath, html, 'utf-8');
    
    console.log('✅ Environment variables injected successfully');
    console.log('   MIDTRANS_CLIENT_KEY:', MIDTRANS_CLIENT_KEY.substring(0, 15) + '...');
    console.log('   SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY.substring(0, 15) + '...');
} catch (error) {
    console.error('❌ Error injecting environment variables:', error.message);
    process.exit(1);
}
