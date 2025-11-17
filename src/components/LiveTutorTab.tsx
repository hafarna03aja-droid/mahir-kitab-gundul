import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Volume2, VolumeX } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    text: string;
    timestamp: number;
}

// Declare Web Speech API types
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

const LiveTutorTab: React.FC = () => {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Klik "Mulai Sesi" untuk berlatih percakapan Arab.');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
    
    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const sessionStarted = useRef(false);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.lang = 'ar-SA'; // Arabic
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                setStatusMessage('🎤 Mendengarkan... Silakan berbicara dalam Bahasa Arab.');
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
                if (isSessionActive && !isProcessing) {
                    setStatusMessage('💬 Sesi aktif. Klik mikrofon untuk berbicara lagi.');
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                if (event.error === 'no-speech') {
                    setStatusMessage('⚠️ Tidak ada suara terdeteksi. Coba lagi.');
                } else if (event.error === 'not-allowed') {
                    setStatusMessage('❌ Izin mikrofon ditolak. Periksa pengaturan browser.');
                } else {
                    setStatusMessage(`⚠️ Error: ${event.error}. Coba lagi.`);
                }
            };

            recognitionRef.current.onresult = async (event: any) => {
                const transcript = event.results[0][0].transcript;
                console.log('Recognized:', transcript);
                
                const userMessage: Message = {
                    role: 'user',
                    text: transcript,
                    timestamp: Date.now()
                };
                
                setMessages(prev => [...prev, userMessage]);
                setIsProcessing(true);
                setStatusMessage('🤔 Ustadz Cerdas sedang berpikir...');
                
                // Get AI response
                await getAIResponse(transcript);
            };
        }

        synthRef.current = window.speechSynthesis;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (synthRef.current) {
                synthRef.current.cancel();
            }
        };
    }, [isSessionActive, isProcessing]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getAIResponse = async (userText: string) => {
        try {
            // Use Maiarouter API
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const apiUrl = import.meta.env.VITE_MAIAROUTER_URL || 'https://api.maiarouter.ai/v1/chat/completions';

            if (!apiKey) {
                setStatusMessage('❌ API Key tidak ditemukan di .env');
                setIsProcessing(false);
                return;
            }

            const conversationHistory = messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'assistant',
                content: m.text
            }));

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'maia/gemini-2.0-flash-exp',
                    messages: [
                        {
                            role: 'system',
                            content: sessionStarted.current 
                                ? `Anda adalah 'Ustadz Cerdas', guru Bahasa Arab Indonesia yang mengajarkan percakapan Arab Saudi. 

ATURAN PENTING:
1. Respons HARUS dalam format 2 bagian:
   - Bagian 1: Kalimat Arab Saudi yang fasih (tanpa harakat)
   - Bagian 2: Penjelasan dalam Bahasa Indonesia

2. Format respons:
   [ARAB] kalimat arab di sini
   [INDO] penjelasan bahasa indonesia di sini

3. Berikan koreksi jika ada kesalahan dengan format:
   [ARAB] kalimat yang benar
   [INDO] Penjelasan: [kesalahan] → [perbaikan]. [penjelasan grammar]

4. Fokus pada percakapan sehari-hari Arab Saudi
5. Gunakan Arab fusha yang mudah dipahami

Contoh respons yang baik:
[ARAB] أهلا وسهلا! كيف حالك اليوم؟
[INDO] Halo dan selamat datang! Bagaimana kabarmu hari ini? Ini adalah sapaan umum dalam percakapan Arab Saudi.`
                                : `Anda adalah 'Ustadz Cerdas', guru Bahasa Arab Indonesia. 

Sapa pengguna dengan format:
[ARAB] السلام عليكم! أهلا وسهلا. أنا أستاذ ذكي. كيف حالك؟
[INDO] Assalamualaikum! Selamat datang. Saya Ustadz Cerdas, guru Bahasa Arab Anda. Mari kita mulai belajar percakapan Arab Saudi. Silakan jawab sapaan saya dalam Bahasa Arab!`
                        },
                        ...conversationHistory,
                        {
                            role: 'user',
                            content: userText
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 200
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const aiText = data.choices[0]?.message?.content || 'Maaf, saya tidak bisa merespons saat ini.';

            const aiMessage: Message = {
                role: 'assistant',
                text: aiText,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, aiMessage]);
            sessionStarted.current = true;
            
            // Speak the response
            speakText(aiText);

        } catch (error) {
            console.error('Error getting AI response:', error);
            setStatusMessage('❌ Gagal mendapatkan respons. Coba lagi.');
            setIsProcessing(false);
        }
    };

    const playAudio = (text: string, lang: 'ar-SA' | 'id-ID', audioId: string) => {
        if (!synthRef.current) {
            alert('⚠️ Text-to-Speech tidak didukung di browser ini.');
            return;
        }

        // Stop any currently playing audio
        if (playingAudioId) {
            synthRef.current.cancel();
        }

        setPlayingAudioId(audioId);
        console.log(`📢 Playing ${lang}:`, text);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = lang === 'ar-SA' ? 0.85 : 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const loadVoicesAndSpeak = () => {
            const voices = synthRef.current!.getVoices();
            
            let selectedVoice;
            if (lang === 'ar-SA') {
                // Priority for Arabic Saudi voices
                selectedVoice = 
                    voices.find(v => v.lang === 'ar-SA') ||
                    voices.find(v => v.name.includes('Saudi')) ||
                    voices.find(v => v.name.includes('Majed')) ||
                    voices.find(v => v.name.includes('Maged')) ||
                    voices.find(v => v.lang.startsWith('ar-')) ||
                    voices.find(v => v.name.includes('Arabic')) ||
                    voices.find(v => v.lang === 'ar');
            } else {
                // Priority for Indonesian voices
                selectedVoice = 
                    voices.find(v => v.lang === 'id-ID') ||
                    voices.find(v => v.name.includes('Indonesian')) ||
                    voices.find(v => v.name.includes('Damayanti')) ||
                    voices.find(v => v.lang.startsWith('id-'));
            }
            
            if (selectedVoice) {
                utterance.voice = selectedVoice;
                console.log('✅ Using voice:', selectedVoice.name, '(' + selectedVoice.lang + ')');
            }

            utterance.onend = () => {
                setPlayingAudioId(null);
            };

            utterance.onerror = (event) => {
                console.error('❌ Speech error:', event.error);
                setPlayingAudioId(null);
            };

            synthRef.current!.cancel();
            synthRef.current!.speak(utterance);
        };

        if (synthRef.current.getVoices().length === 0) {
            synthRef.current.addEventListener('voiceschanged', loadVoicesAndSpeak, { once: true });
            setTimeout(loadVoicesAndSpeak, 100);
        } else {
            loadVoicesAndSpeak();
        }
    };

    const stopAudio = () => {
        if (synthRef.current) {
            synthRef.current.cancel();
            setPlayingAudioId(null);
        }
    };

    const speakText = (text: string) => {
        if (!synthRef.current) {
            setIsProcessing(false);
            setStatusMessage('⚠️ Text-to-Speech tidak didukung di browser ini.');
            return;
        }

        // Extract Indonesian text only (after [INDO] tag)
        const indonesianMatch = text.match(/\[INDO\]\s*(.+?)$/s);
        const indonesianText = indonesianMatch ? indonesianMatch[1].trim() : text;

        console.log('📢 Speaking Indonesian tutor:', indonesianText);

        setIsSpeaking(true);
        setStatusMessage('🔊 Ustadz Cerdas sedang menjelaskan dalam Bahasa Indonesia...');

        const utterance = new SpeechSynthesisUtterance(indonesianText);
        utterance.lang = 'id-ID'; // Bahasa Indonesia
        utterance.rate = 0.9; // Natural speaking rate
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Load voices and select best Indonesian voice
        const loadVoicesAndSpeak = () => {
            const voices = synthRef.current!.getVoices();
            console.log('🎤 Available voices:', voices.length);
            
            // Priority order for Indonesian voices
            let indonesianVoice = 
                // 1. Indonesian voices (id-ID)
                voices.find(v => v.lang === 'id-ID') ||
                voices.find(v => v.name.includes('Indonesian')) ||
                voices.find(v => v.name.includes('Indonesia')) ||
                voices.find(v => v.name.includes('Damayanti')) ||
                // 2. Any Indonesian variant
                voices.find(v => v.lang.startsWith('id-')) ||
                // 3. Malay as fallback (similar language)
                voices.find(v => v.lang === 'ms-MY') ||
                voices.find(v => v.name.includes('Malay'));
            
            if (indonesianVoice) {
                utterance.voice = indonesianVoice;
                console.log('✅ Using Indonesian voice:', indonesianVoice.name, '(' + indonesianVoice.lang + ')');
            } else {
                console.warn('⚠️ No Indonesian voice found, using default (voice may sound unnatural)');
            }

            utterance.onstart = () => {
                console.log('🔊 Started speaking Indonesian explanation');
            };

            utterance.onend = () => {
                console.log('✅ Finished speaking Indonesian');
                setIsSpeaking(false);
                setIsProcessing(false);
                setStatusMessage('✅ Giliran Anda! Klik mikrofon untuk berbicara dalam Bahasa Arab.');
            };

            utterance.onerror = (event) => {
                console.error('❌ Speech error:', event.error);
                setIsSpeaking(false);
                setIsProcessing(false);
                setStatusMessage('⚠️ Error saat berbicara. Silakan lanjutkan.');
            };

            synthRef.current!.cancel(); // Cancel any ongoing speech
            synthRef.current!.speak(utterance);
        };

        // Ensure voices are loaded
        if (synthRef.current.getVoices().length === 0) {
            synthRef.current.addEventListener('voiceschanged', loadVoicesAndSpeak, { once: true });
            // Fallback timeout
            setTimeout(loadVoicesAndSpeak, 100);
        } else {
            loadVoicesAndSpeak();
        }
    };

    const startListening = () => {
        if (!recognitionRef.current) {
            alert('⚠️ Speech Recognition tidak didukung di browser ini.\n\nGunakan Chrome, Edge, atau Safari.');
            return;
        }

        if (isListening || isProcessing || isSpeaking) {
            return;
        }

        try {
            recognitionRef.current.start();
        } catch (error) {
            console.error('Error starting recognition:', error);
            setStatusMessage('⚠️ Gagal memulai pengenalan suara. Coba lagi.');
        }
    };

    const startSession = async () => {
        setIsSessionActive(true);
        setMessages([]);
        sessionStarted.current = false;
        setStatusMessage('🎉 Sesi dimulai! Menghubungkan dengan Ustadz Cerdas...');
        
        // Load voices
        if (synthRef.current) {
            if (synthRef.current.getVoices().length === 0) {
                synthRef.current.addEventListener('voiceschanged', () => {
                    console.log('Voices loaded:', synthRef.current?.getVoices().length);
                }, { once: true });
            }
        }

        // Start with greeting from AI
        setIsProcessing(true);
        await getAIResponse('Mulai sesi');
    };

    const stopSession = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        if (synthRef.current) {
            synthRef.current.cancel();
        }
        
        setIsSessionActive(false);
        setIsListening(false);
        setIsSpeaking(false);
        setIsProcessing(false);
        sessionStarted.current = false;
        setStatusMessage('Sesi berakhir. Klik "Mulai Sesi" untuk berlatih lagi.');
    };

    const handleToggleSession = () => {
        if (isSessionActive) {
            stopSession();
        } else {
            startSession();
        }
    };

    return (
        <div className="bg-slate-800 rounded-lg shadow-lg flex flex-col h-[75vh]">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 text-center">
                <h2 className="text-xl font-bold text-amber-400">AI Audio Live: Ustadz Cerdas</h2>
                <p className="text-slate-400 text-sm mt-1">Berlatih percakapan Bahasa Arab dengan AI (Speech Recognition + Text-to-Speech)</p>
                <div className="mt-3 flex items-center justify-center gap-2 text-slate-300">
                    <div className={`w-3 h-3 rounded-full transition-colors ${
                        isSessionActive ? 'bg-green-500 animate-pulse' : 'bg-slate-500'
                    }`}></div>
                    <span className="font-medium text-sm">{statusMessage}</span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.length === 0 && !isSessionActive && (
                    <div className="text-center text-slate-500 pt-16">
                        <Mic className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                        <p className="text-lg">Klik "Mulai Sesi" untuk memulai percakapan</p>
                        <p className="text-sm mt-2">Anda akan berbicara dengan Ustadz Cerdas</p>
                    </div>
                )}
                
                {messages.map((msg, index) => {
                    // Parse [ARAB] and [INDO] tags for assistant messages
                    const arabicMatch = msg.text.match(/\[ARAB\]\s*(.+?)(?:\s*\[INDO\]|$)/s);
                    const indonesianMatch = msg.text.match(/\[INDO\]\s*(.+?)$/s);
                    
                    const arabicText = arabicMatch ? arabicMatch[1].trim() : null;
                    const indonesianText = indonesianMatch ? indonesianMatch[1].trim() : null;
                    const isFormatted = arabicText || indonesianText;

                    const arabicAudioId = `arabic-${index}`;
                    const indoAudioId = `indo-${index}`;
                    const userAudioId = `user-${index}`;

                    return (
                        <div key={index} className={`flex items-start gap-3 ${
                            msg.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}>
                            {msg.role === 'assistant' && (
                                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="font-bold text-amber-400 text-xs">UC</span>
                                </div>
                            )}
                            <div className={`max-w-2xl rounded-lg px-4 py-3 ${
                                msg.role === 'user' 
                                    ? 'bg-sky-600 text-white' 
                                    : 'bg-slate-700 text-slate-200'
                            }`}>
                                {msg.role === 'assistant' && isFormatted ? (
                                    <>
                                        {arabicText && (
                                            <div className="mb-3 pb-3 border-b border-slate-600">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-xs text-amber-400 font-semibold">🗣️ Bahasa Arab:</p>
                                                    <button
                                                        onClick={() => playingAudioId === arabicAudioId ? stopAudio() : playAudio(arabicText, 'ar-SA', arabicAudioId)}
                                                        className="p-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 transition-colors"
                                                        title="Dengarkan Arab Saudi"
                                                    >
                                                        {playingAudioId === arabicAudioId ? (
                                                            <VolumeX className="w-4 h-4 text-amber-400" />
                                                        ) : (
                                                            <Volume2 className="w-4 h-4 text-amber-400" />
                                                        )}
                                                    </button>
                                                </div>
                                                <p className="font-arabic text-xl leading-relaxed text-white" dir="rtl">{arabicText}</p>
                                            </div>
                                        )}
                                        {indonesianText && (
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-xs text-green-400 font-semibold">📖 Penjelasan:</p>
                                                    <button
                                                        onClick={() => playingAudioId === indoAudioId ? stopAudio() : playAudio(indonesianText, 'id-ID', indoAudioId)}
                                                        className="p-1.5 rounded-full bg-green-500/20 hover:bg-green-500/30 transition-colors"
                                                        title="Dengarkan Bahasa Indonesia"
                                                    >
                                                        {playingAudioId === indoAudioId ? (
                                                            <VolumeX className="w-4 h-4 text-green-400" />
                                                        ) : (
                                                            <Volume2 className="w-4 h-4 text-green-400" />
                                                        )}
                                                    </button>
                                                </div>
                                                <p className="text-base leading-relaxed text-slate-200">{indonesianText}</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="font-arabic text-lg leading-relaxed flex-1" dir={msg.role === 'user' ? 'rtl' : 'ltr'}>
                                                {msg.text}
                                            </p>
                                            {msg.role === 'user' && (
                                                <button
                                                    onClick={() => playingAudioId === userAudioId ? stopAudio() : playAudio(msg.text, 'ar-SA', userAudioId)}
                                                    className="p-1.5 rounded-full bg-sky-500/20 hover:bg-sky-500/30 transition-colors flex-shrink-0"
                                                    title="Dengarkan ulang"
                                                >
                                                    {playingAudioId === userAudioId ? (
                                                        <VolumeX className="w-4 h-4 text-sky-200" />
                                                    ) : (
                                                        <Volume2 className="w-4 h-4 text-sky-200" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                                <p className="text-xs opacity-60 mt-2">
                                    {new Date(msg.timestamp).toLocaleTimeString('id-ID', { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })}
                                </p>
                            </div>
                            {msg.role === 'user' && (
                                <div className="w-10 h-10 rounded-full bg-sky-600/20 flex items-center justify-center flex-shrink-0">
                                    <span className="font-bold text-sky-400 text-xs">Anda</span>
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Controls */}
            <div className="p-4 bg-slate-900/50 border-t border-slate-700">
                <div className="flex justify-center items-center gap-4">
                    {/* Start/Stop Session Button */}
                    <button
                        onClick={handleToggleSession}
                        disabled={isProcessing}
                        className={`px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                            ${isSessionActive 
                                ? 'bg-red-600 text-white hover:bg-red-700' 
                                : 'bg-amber-500 text-white hover:bg-amber-600'
                            }`}
                    >
                        {isSessionActive ? (
                            <>
                                <Square className="w-6 h-6" />
                                <span>Hentikan Sesi</span>
                            </>
                        ) : (
                            <>
                                <Volume2 className="w-6 h-6" />
                                <span>Mulai Sesi</span>
                            </>
                        )}
                    </button>

                    {/* Microphone Button (only show when session active) */}
                    {isSessionActive && (
                        <button
                            onClick={startListening}
                            disabled={isListening || isProcessing || isSpeaking}
                            className={`p-5 rounded-full font-bold transition-all duration-300 transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                                ${isListening 
                                    ? 'bg-red-500 text-white animate-pulse' 
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                            title={isListening ? 'Mendengarkan...' : 'Klik untuk berbicara'}
                        >
                            <Mic className={`w-7 h-7 ${isListening ? 'animate-bounce' : ''}`} />
                        </button>
                    )}
                </div>
                
                {isSessionActive && (
                    <p className="text-center text-slate-400 text-sm mt-3">
                        {isListening ? '🎤 Sedang mendengarkan...' : 
                         isSpeaking ? '🔊 Ustadz sedang berbicara...' :
                         isProcessing ? '⏳ Memproses...' :
                         '💡 Klik tombol mikrofon hijau untuk berbicara'}
                    </p>
                )}
            </div>
        </div>
    );
};

export default LiveTutorTab;
