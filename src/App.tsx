import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import DashboardApp from './DashboardApp';
import MainApp from './components/MainApp';
import PreviewModeWrapper from './components/PreviewModeWrapper';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import LandingPage from './pages/LandingPage';

const Home: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [previewMode, setPreviewMode] = useState(false);

    useEffect(() => {
        // Check if user just completed payment
        const paymentCompleted = localStorage.getItem('payment_completed');
        const paymentEmail = localStorage.getItem('payment_email');

        if (paymentCompleted === 'true' && paymentEmail) {
            // Clear payment flags
            localStorage.removeItem('payment_completed');
            localStorage.removeItem('payment_email');

            // Store email for login
            localStorage.setItem('user_email', paymentEmail);
        }

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
                {/* Landing Page - Public */}
                <Route path="/" element={<LandingPage />} />

                {/* Password Reset - Public */}
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Member Area - Protected */}
                <Route path="/app" element={<Home />} />
                <Route path="/app/terms" element={<TermsPage />} />
                <Route path="/app/privacy" element={<PrivacyPage />} />
            </Routes>
        </Router>
    );
};

export default App;
