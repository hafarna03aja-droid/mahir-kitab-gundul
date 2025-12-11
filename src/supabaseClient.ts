import { createClient } from '@supabase/supabase-js';

// Load Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that required environment variables are defined
if (!supabaseUrl || typeof supabaseUrl !== 'string') {
    throw new Error(
        'Missing VITE_SUPABASE_URL environment variable. ' +
        'Please check your .env file and ensure VITE_SUPABASE_URL is set.'
    );
}

if (!supabaseAnonKey || typeof supabaseAnonKey !== 'string') {
    throw new Error(
        'Missing VITE_SUPABASE_ANON_KEY environment variable. ' +
        'Please check your .env file and ensure VITE_SUPABASE_ANON_KEY is set.'
    );
}

// Create Supabase client with validated credentials
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
