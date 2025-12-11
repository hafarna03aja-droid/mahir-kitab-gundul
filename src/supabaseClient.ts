import { createClient } from '@supabase/supabase-js';

// Load Supabase configuration strictly from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Validate VITE_SUPABASE_URL
if (!supabaseUrl || typeof supabaseUrl !== 'string' || supabaseUrl.trim() === '') {
    throw new Error(
        '[Supabase Config Error] Missing or invalid VITE_SUPABASE_URL.\n' +
        '  - Ensure your .env file contains: VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
        '  - Restart the dev server after modifying .env\n' +
        `  - Current value: ${supabaseUrl === undefined ? 'undefined' : `"${supabaseUrl}"`}`
    );
}

// Validate VITE_SUPABASE_ANON_KEY
if (!supabaseAnonKey || typeof supabaseAnonKey !== 'string' || supabaseAnonKey.trim() === '') {
    throw new Error(
        '[Supabase Config Error] Missing or invalid VITE_SUPABASE_ANON_KEY.\n' +
        '  - Ensure your .env file contains: VITE_SUPABASE_ANON_KEY=your-anon-key\n' +
        '  - The anon key can be found in Supabase Dashboard > Settings > API\n' +
        '  - Restart the dev server after modifying .env\n' +
        `  - Current value: ${supabaseAnonKey === undefined ? 'undefined' : '"[REDACTED]"'}`
    );
}

// Validate URL format
try {
    new URL(supabaseUrl);
} catch {
    throw new Error(
        '[Supabase Config Error] VITE_SUPABASE_URL is not a valid URL.\n' +
        `  - Current value: "${supabaseUrl}"\n` +
        '  - Expected format: https://your-project.supabase.co'
    );
}

// Create Supabase client with validated credentials
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
