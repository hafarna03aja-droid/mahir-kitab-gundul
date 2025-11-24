import React, { useState, useRef, useEffect } from 'react';
import { askAiAssistant } from '../services/aiService';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon } from './icons/TabIcons';

// Komponen kecil untuk merender Markdown dengan gaya
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const renderSegment = (segment: string, index: number) => {
        // Bold: **text**
        if (segment.startsWith('**') && segment.endsWith('**')) {
            return <strong key={index} className="font-bold text-sky-600">{segment.slice(2, -2)}</strong>;
        }
        // Inline code: `text`
        if (segment.startsWith('`') && segment.endsWith('`')) {
            return <code key={index} className="font-arabic text-emerald-700 bg-emerald-50 text-lg px-2 py-1 rounded-md">{segment.slice(1, -1)}</code>;
        }
        return <span key={index}>{segment}</span>;
    };

    const renderLine = (line: string, lineIndex: number) => {
        // Headings: ###
        if (line.startsWith('### ')) {
            return <h3 key={lineIndex} className="text-xl font-bold text-amber-600 mt-4 mb-2">{line.substring(4)}</h3>;
        }
        // Blockquotes: >
        if (line.startsWith('> ')) {
            return <blockquote key={lineIndex} className="border-l-4 border-amber-500 pl-4 my-2 text-slate-600 italic">{line.substring(2)}</blockquote>;
        }
        // List items: * or -
        if (line.startsWith('* ') || line.startsWith('- ')) {
            const segments = line.substring(2).split(/(\*\*.*?\*\*|`.*?`)/g).filter(Boolean);
            return (
                <li key={lineIndex} className="ml-5 list-disc list-outside">
                    {segments.map(renderSegment)}
                </li>
            );
        }

        // Regular text with inline formatting
        const segments = line.split(/(\*\*.*?\*\*|`.*?`)/g).filter(Boolean);
        return <p key={lineIndex}>{segments.map(renderSegment)}</p>;
    };

    return (
        <div className="prose prose-slate prose-p:text-slate-700">
            {content.split('\n').map((line, i) => renderLine(line, i))}
        </div>
    );
};


const AiAssistantTab: React.FC = () => {
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Assalamualaikum! Saya Asisten Cerdas Anda. Silakan tanyakan apa saja tentang kaidah Nahwu, Sharaf, atau Balaghah.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const newMessages = [...messages, { sender: 'user', text: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponse = await askAiAssistant(input);
            setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
        } catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : 'Maaf, terjadi kesalahan.';
            setMessages(prev => [...prev, { sender: 'ai', text: `Error: ${errorMessage}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg flex flex-col h-[75vh]">
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && (
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <ChatBubbleLeftRightIcon className="w-6 h-6 text-amber-600" />
                            </div>
                        )}
                        <div className={`max-w-xl rounded-lg px-5 py-3 ${msg.sender === 'user' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-800'}`}>
                            {msg.sender === 'ai' ? <MarkdownRenderer content={msg.text} /> : <p>{msg.text}</p>}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-3 justify-start">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <ChatBubbleLeftRightIcon className="w-6 h-6 text-amber-600" />
                        </div>
                        <div className="max-w-xl rounded-lg px-5 py-3 bg-slate-100 text-slate-700">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Tanyakan sesuatu, contoh: 'Apa itu I'rab?'"
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-amber-500 text-white rounded-lg p-3 flex-shrink-0 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                        aria-label="Kirim Pesan"
                    >
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AiAssistantTab;
