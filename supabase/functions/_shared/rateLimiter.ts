import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// KITA KEMBALIKAN KE FORMAT STANDARD (URL, KEY, TOKEN) AGAR TIDAK CRASH
export const createSupabaseClient = (supabaseUrl: string, supabaseKey: string, token: string) => {
    return new SupabaseClient(supabaseUrl, supabaseKey, {
        global: {
            headers: { Authorization: `Bearer ${token}` },
        },
    });
};

export async function checkRateLimit(supabase: SupabaseClient, userId: string) {
    const MAX_DAILY_LIMIT = 100;

    // 1. Ambil Data User (Limit & Tanggal Expired)
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('daily_usage_count, subscription_expires_at')
        .eq('id', userId)
        .single();

    if (error || !profile) {
        console.error("Profile Check Error:", error);
        // Jika profil tidak ditemukan, anggap error auth/security
        return { allowed: false, error: "Profile not found", status: 401 };
    }

    console.log(`[RateLimit] User: ${userId} | Count: ${profile.daily_usage_count} | Exp: ${profile.subscription_expires_at}`);

    // 2. CEK PRIORITAS UTAMA: Apakah Expired?
    // Kita cek apakah tanggal expired ada dan apakah sudah lewat
    if (profile.subscription_expires_at) {
        const now = new Date();
        const expiresAt = new Date(profile.subscription_expires_at);

        if (now > expiresAt) {
            // BLOKIR KARENA EXPIRED (Status 403)
            return { allowed: false, error: "SUBSCRIPTION_EXPIRED", status: 403 };
        }
    }

    // 3. CEK KEDUA: Apakah Kuota Habis?
    if (profile.daily_usage_count >= MAX_DAILY_LIMIT) {
        // BLOKIR KARENA KUOTA (Status 429)
        return { allowed: false, error: "DAILY_LIMIT_REACHED", status: 429 };
    }

    // 4. Lolos Semua Cek (Aman)
    return { allowed: true };
}

export async function incrementUsage(supabaseAdmin: SupabaseClient, userId: string) {
    // Coba panggil RPC (jika Anda punya stored procedure 'increment_daily_usage')
    const { error: rpcError } = await supabaseAdmin.rpc('increment_daily_usage', { user_id: userId });

    if (rpcError) {
        // Fallback: Manual update jika RPC tidak ada
        // Ambil dulu data terakhir
        const { data } = await supabaseAdmin.from('profiles').select('daily_usage_count').eq('id', userId).single();

        if (data) {
            await supabaseAdmin
                .from('profiles')
                .update({
                    daily_usage_count: data.daily_usage_count + 1,
                    last_usage_date: new Date().toISOString()
                })
                .eq('id', userId);
        }
    }
}