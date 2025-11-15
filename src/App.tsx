import React, { useState } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import AnalysisTab from './components/AnalysisTab';
import AiAssistantTab from './components/AiAssistantTab';
import LiveTutorTab from './components/LiveTutorTab';
import KitabTab from './components/KitabTab';
import Footer from './components/Footer';
import type { TabId } from './types';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabId>('analisis');

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

export default App;
