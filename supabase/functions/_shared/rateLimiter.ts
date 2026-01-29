import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

export const createSupabaseClient = (req: Request) => {
    return new SupabaseClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        {
            global: { headers: { Authorization: req.headers.get('Authorization')! } },
        }
    )
}

// Client Admin (Bypass RLS) untuk update counter
export const createAdminClient = () => {
    return new SupabaseClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
}

export async function checkRateLimit(supabase: SupabaseClient, userId: string) {
    const MAX_DAILY_LIMIT = 100;

    // 1. Ambil Data User
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('daily_usage_count, subscription_expires_at')
        .eq('id', userId)
        .single();

    if (error || !profile) {
        console.error("Profile Error:", error);
        // Jika profil tidak ketemu, blokir demi keamanan
        return { allowed: false, error: "Profile not found", status: 401 };
    }

    // Debugging Log (Cek ini di Supabase Dashboard jika error)
    console.log(`User: ${userId} | Count: ${profile.daily_usage_count} | Exp: ${profile.subscription_expires_at}`);

    // 2. CEK PRIORITAS UTAMA: Apakah Expired?
    const now = new Date();
    const expiresAt = new Date(profile.subscription_expires_at);

    // Validasi tanggal (jaga-jaga jika null)
    if (!profile.subscription_expires_at || isNaN(expiresAt.getTime())) {
        // Jika tidak ada tanggal expire, anggap expired (atau ubah logic ini sesuai kebutuhan bisnis)
        return { allowed: false, error: "SUBSCRIPTION_INVALID", status: 403 };
    }

    if (now > expiresAt) {
        return { allowed: false, error: "SUBSCRIPTION_EXPIRED", status: 403 };
    }

    // 3. CEK KEDUA: Apakah Kuota Habis?
    if (profile.daily_usage_count >= MAX_DAILY_LIMIT) {
        return { allowed: false, error: "DAILY_LIMIT_REACHED", status: 429 };
    }

    // 4. Lolos Semua Cek
    return { allowed: true };
}

export async function incrementUsage(supabaseAdmin: SupabaseClient, userId: string) {
    // Pakai RPC (Stored Procedure) atau update biasa. 
    // Update biasa lebih aman jika RLS sudah dibuka untuk service role.
    const { error } = await supabaseAdmin
        .from('profiles')
        .update({
            daily_usage_count:  // Increment manual (fetch + update) rawan race condition, tapi oke untuk skala kecil.
                // Idealnya pakai rpc('increment_usage') 
                // Untuk sekarang kita pakai trik SQL raw via rpc jika ada, atau update biasa:
                // Kita asumsikan update dilakukan setelah fetch di checkRateLimit, 
                // tapi incrementUsage biasanya dipanggil terpisah.
                // Agar simpel dan pasti jalan:
                last_usage_date: new Date().toISOString()
        })
        .eq('id', userId); // PENTING: increment logic harusnya atomic, 
    // tapi di sini kita hanya update timestamp dulu.
    // INCREMENT SEBENARNYA:

    const { error: rpcError } = await supabaseAdmin.rpc('increment_daily_usage', { user_id: userId });
    if (rpcError) {
        console.error("RPC Error:", rpcError);
        // Fallback manual increment (Not Atomic)
        const { data } = await supabaseAdmin.from('profiles').select('daily_usage_count').eq('id', userId).single();
        if (data) {
            await supabaseAdmin.from('profiles').update({ daily_usage_count: data.daily_usage_count + 1 }).eq('id', userId);
        }
    }
}