import React from 'react';
import { Search, BookOpen, MessageCircle, Mic } from 'lucide-react';
import type { TabId } from '../types';

interface TabsProps {
    activeTab: TabId;
    setActiveTab: (tab: TabId) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'analisis' as TabId, label: 'Analisis Teks', icon: Search },
        { id: 'kitab' as TabId, label: 'Kitab Digital', icon: BookOpen },
        { id: 'asisten' as TabId, label: 'Asisten AI', icon: MessageCircle },
        { id: 'tutor' as TabId, label: 'AI Audio', icon: Mic },
    ];

    return (
        <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-t-lg shadow-sm transition-colors duration-300">
            <nav className="flex space-x-2 overflow-x-auto px-4">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Tabs;
