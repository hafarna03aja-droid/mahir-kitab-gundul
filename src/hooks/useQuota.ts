import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export const MAX_DAILY_LIMIT = 100;

export interface QuotaInfo {
    used: number;
    remaining: number;
    max: number;
    lastResetDate: string | null;
    loading: boolean;
}

export function useQuota() {
    const [quota, setQuota] = useState<QuotaInfo>({
        used: 0,
        remaining: MAX_DAILY_LIMIT,
        max: MAX_DAILY_LIMIT,
        lastResetDate: null,
        loading: true,
    });

    const fetchQuota = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setQuota(prev => ({ ...prev, loading: false }));
                return;
            }

            const today = new Date().toISOString().split('T')[0];

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('daily_usage_count, last_usage_date')
                .eq('id', user.id)
                .maybeSingle();

            if (error || !profile) {
                setQuota(prev => ({ ...prev, loading: false }));
                return;
            }

            // Jika last_usage_date bukan hari ini, counter dianggap 0 (belum dipakai hari ini)
            const isToday = profile.last_usage_date === today;
            const used = isToday ? (profile.daily_usage_count ?? 0) : 0;
            const remaining = Math.max(0, MAX_DAILY_LIMIT - used);

            setQuota({
                used,
                remaining,
                max: MAX_DAILY_LIMIT,
                lastResetDate: profile.last_usage_date,
                loading: false,
            });
        } catch {
            setQuota(prev => ({ ...prev, loading: false }));
        }
    }, []);

    useEffect(() => {
        fetchQuota();
    }, [fetchQuota]);

    // Fungsi untuk refresh kuota setelah AI dipakai
    const refreshQuota = useCallback(() => {
        fetchQuota();
    }, [fetchQuota]);

    return { quota, refreshQuota };
}
