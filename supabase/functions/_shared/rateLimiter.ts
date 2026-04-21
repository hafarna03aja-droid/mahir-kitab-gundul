import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// KITA UPDATE BAGIAN INI AGAR TOKEN BERSIFAT OPSIONAL
export const createSupabaseClient = (supabaseUrl: string, supabaseKey: string, token?: string) => {
    const options: any = {};

    // Jika ada token (User), pakai Authorization header
    if (token) {
        options.global = {
            headers: { Authorization: `Bearer ${token}` },
        };
    }

    // Jika tidak ada token (Admin), biarkan kosong (dia akan pakai Key sebagai auth)
    return new SupabaseClient(supabaseUrl, supabaseKey, options);
};

export async function checkRateLimit(supabase: SupabaseClient, userId: string) {
    const MAX_DAILY_LIMIT = 100;

    // 1. Ambil Data (TAMBAHKAN 'last_usage_date')
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('daily_usage_count, subscription_expires_at, last_usage_date')
        .eq('id', userId)
        .single();

    if (error || !profile) return { allowed: false, error: "Profile error", status: 401 };

    // 2. CEK EXPIRED (Prioritas Utama)
    if (profile.subscription_expires_at) {
        if (new Date() > new Date(profile.subscription_expires_at)) {
            return { allowed: false, error: "SUBSCRIPTION_EXPIRED", status: 403 };
        }
    }

    // 3. LOGIKA RESET HARIAN (Kunci Jawaban Anda)
    const today = new Date().toISOString().split('T')[0]; // Ambil tanggal hari ini (YYYY-MM-DD)

    // Jika last_usage_date kosong ATAU tanggalnya BUKAN hari ini
    if (!profile.last_usage_date || profile.last_usage_date !== today) {
        // Anggap user ini bersih (count 0), jadi BOLEH LEWAT.
        // Nanti fungsi SQL 'increment' yang akan mereset angkanya jadi 1 di database.
        return { allowed: true };
    }

    // 4. CEK KUOTA (Hanya jika tanggalnya masih SAMA dengan hari ini)
    if (profile.daily_usage_count >= MAX_DAILY_LIMIT) {
        return { allowed: false, error: "DAILY_LIMIT_REACHED", status: 429 };
    }

    return { allowed: true };
}

export async function incrementUsage(supabaseAdmin: SupabaseClient, userId: string) {
    // Coba panggil RPC (jika Anda punya stored procedure 'increment_daily_usage')
    const { error: rpcError } = await supabaseAdmin.rpc('increment_daily_usage', { user_id: userId });

    if (rpcError) {
        // Fallback: Manual update jika RPC tidak ada
        // Ambil dulu data terakhir
        const { data } = await supabaseAdmin.from('profiles').select('daily_usage_count, last_usage_date').eq('id', userId).single();

        if (data) {
            const today = new Date().toISOString().split('T')[0];
            const isToday = data.last_usage_date === today;
            
            await supabaseAdmin
                .from('profiles')
                .update({
                    daily_usage_count: isToday ? data.daily_usage_count + 1 : 1,
                    last_usage_date: today
                })
                .eq('id', userId);
        }
    }
}