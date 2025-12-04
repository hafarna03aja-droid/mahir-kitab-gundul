import React, { useState, useEffect } from 'react';
import Header from './Header';
import Tabs from './Tabs';
import AnalysisTab from './AnalysisTab';
import AiAssistantTab from './AiAssistantTab';
import LiveTutorTab from './LiveTutorTab';
import KitabTab from './KitabTab';
import Footer from './Footer';
import type { TabId } from '../types';

const MainApp: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabId>('analisis');
    
    // Auto-initialize API keys from environment variables
    useEffect(() => {
        const maiaKey = import.meta.env.VITE_MAIA_API_KEY;
        const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
        
        // Set Maia key if available and not already set
        if (maiaKey && !localStorage.getItem('maia_api_key')) {
            localStorage.setItem('maia_api_key', maiaKey);
        }
        
        // Set Gemini key if available and not already set
        if (geminiKey && !localStorage.getItem('gemini_api_key')) {
            localStorage.setItem('gemini_api_key', geminiKey);
        }
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'analisis':
                return <AnalysisTab />;
            case 'kitab':
                return <KitabTab />;
            case 'asisten':
                return <AiAssistantTab />;
            case 'tutor':
                return <LiveTutorTab />;
            default:
                return <AnalysisTab />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-200 flex flex-col transition-colors duration-300">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="mt-8">
                    {renderContent()}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MainApp;
