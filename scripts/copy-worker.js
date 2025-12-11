import { copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const source = join(__dirname, '..', '_worker.js');
const dest = join(__dirname, '..', 'dist', '_worker.js');

try {
    copyFileSync(source, dest);
    console.log('✅ _worker.js copied to dist/_worker.js');
} catch (error) {
    console.error('❌ Error copying _worker.js:', error.message);
    process.exit(1);
}
