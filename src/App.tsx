import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';
import Login from './components/Login';
import DashboardApp from './DashboardApp';

const App: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
    }

    if (!session) {
        return <Login />;
    }

    return <DashboardApp session={session} />;
};

export default App;
