import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';
import Login from './components/Login';
import DashboardApp from './DashboardApp';
import MainApp from './components/MainApp';
import PreviewModeWrapper from './components/PreviewModeWrapper';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

const Home: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [previewMode, setPreviewMode] = useState(false);

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

    // Preview mode - show MainApp with restrictions
    if (previewMode) {
        return (
            <PreviewModeWrapper>
                <MainApp />
            </PreviewModeWrapper>
        );
    }

    if (!session) {
        return <Login onPreviewMode={() => setPreviewMode(true)} />;
    }

    return <DashboardApp session={session} />;
};

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    );
};

export default App;
