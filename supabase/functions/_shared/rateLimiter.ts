/**
 * Rate Limiter Module for Supabase Edge Functions
 * 
 * Implements 100 requests/day rate limiting per user.
 * 
 * Usage:
 * 1. Import this module at the top of your Edge Function
 * 2. Call checkRateLimit() after authenticating the user
 * 3. Call incrementUsage() after successful response
 */

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

// Rate limit configuration
const DAILY_LIMIT = 100;

// Get today's date in UTC (YYYY-MM-DD format)
function getTodayUTC(): string {
    return new Date().toISOString().split('T')[0];
}

interface RateLimitResult {
    allowed: boolean;
    currentCount: number;
    remainingQuota: number;
    error?: string;
}

/**
 * Check if user has exceeded daily rate limit
 * Also handles automatic reset when date changes
 */
export async function checkRateLimit(
    supabaseClient: SupabaseClient,
    userId: string
): Promise<RateLimitResult> {
    const today = getTodayUTC();

    // Fetch user's current usage data and subscription status
    const { data: profile, error: fetchError } = await supabaseClient
        .from('profiles')
        .select('daily_usage_count, last_usage_date, subscription_expires_at')
        .eq('id', userId)
        .single();

    if (fetchError) {
        console.error('Error fetching rate limit data:', fetchError);
        return {
            allowed: false,
            currentCount: 0,
            remainingQuota: 0,
            error: 'Gagal memeriksa kuota pengguna'
        };
    }

    // NOTE: Premium users are now also subject to rate limit (100/day)
    // Subscription status is kept for reference but not used for bypass

    let currentCount = profile?.daily_usage_count || 0;
    const lastUsageDate = profile?.last_usage_date;

    // RESET LOGIC: If last usage date != today, reset counter
    if (lastUsageDate !== today) {
        const { error: resetError } = await supabaseClient
            .from('profiles')
            .update({
                daily_usage_count: 0,
                last_usage_date: today
            })
            .eq('id', userId);

        if (resetError) {
            console.error('Error resetting daily counter:', resetError);
        }

        currentCount = 0;
    }

    // CHECK LOGIC: If count >= limit, deny access
    if (currentCount >= DAILY_LIMIT) {
        return {
            allowed: false,
            currentCount: currentCount,
            remainingQuota: 0,
            error: 'Batas harian tercapai (100 request). Silakan kembali besok.'
        };
    }

    return {
        allowed: true,
        currentCount: currentCount,
        remainingQuota: DAILY_LIMIT - currentCount
    };
}

/**
 * Increment the user's daily usage count
 * Call this AFTER a successful API response
 */
export async function incrementUsage(
    supabaseClient: SupabaseClient,
    userId: string
): Promise<void> {
    const today = getTodayUTC();

    // Fetch current count first
    const { data: profile } = await supabaseClient
        .from('profiles')
        .select('daily_usage_count')
        .eq('id', userId)
        .single();

    const currentCount = profile?.daily_usage_count || 0;

    // Update with incremented value
    const { error } = await supabaseClient
        .from('profiles')
        .update({
            daily_usage_count: currentCount + 1,
            last_usage_date: today
        })
        .eq('id', userId);

    if (error) {
        console.error('Error incrementing usage count:', error);
        // Non-blocking: don't throw, just log
    }
}

/**
 * Create a Supabase client for Edge Functions
 * @param authToken - Optional. If provided, creates a User client with Authorization header.
 *                    If omitted, creates an Admin client (no Authorization header = bypasses RLS with SERVICE_ROLE_KEY).
 */
export function createSupabaseClient(
    supabaseUrl: string,
    supabaseKey: string,
    authToken?: string
): SupabaseClient {
    // Mode Admin: Tanpa authToken = bypass RLS (gunakan dengan SERVICE_ROLE_KEY)
    if (!authToken) {
        return createClient(supabaseUrl, supabaseKey);
    }

    // Mode User: Dengan authToken = mengikuti RLS
    return createClient(supabaseUrl, supabaseKey, {
        global: {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        }
    });
}

// =============================================================
// COPY-PASTE SNIPPET FOR YOUR EDGE FUNCTION
// =============================================================
//
// Paste this at the TOP of your Edge Function (after imports):
//
// ```typescript
// import { checkRateLimit, incrementUsage, createSupabaseClient } from '../_shared/rateLimiter.ts';
//
// // Inside serve() handler, after CORS check:
//
// // --- RATE LIMITING START ---
// const authHeader = req.headers.get('Authorization');
// if (!authHeader) {
//     return new Response(JSON.stringify({ error: 'Unauthorized' }), {
//         status: 401,
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' }
//     });
// }
//
// const token = authHeader.replace('Bearer ', '');
// const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
// const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
// const supabase = createSupabaseClient(supabaseUrl, supabaseKey, token);
//
// // Verify token and get user
// const { data: { user }, error: authError } = await supabase.auth.getUser(token);
// if (authError || !user) {
//     return new Response(JSON.stringify({ error: 'Token tidak valid' }), {
//         status: 401,
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' }
//     });
// }
//
// // Check rate limit
// const rateLimitResult = await checkRateLimit(supabase, user.id);
// if (!rateLimitResult.allowed) {
//     return new Response(JSON.stringify({
//         error: rateLimitResult.error,
//         code: 'RATE_LIMIT_EXCEEDED',
//         remaining: 0
//     }), {
//         status: 429,
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' }
//     });
// }
// // --- RATE LIMITING END ---
//
// // ... your existing logic here ...
//
// // Before returning success response, increment usage:
// await incrementUsage(supabase, user.id);
// ```
