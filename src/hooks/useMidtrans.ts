import { useState, useEffect } from 'react';

interface MidtransConfig {
    isProduction: boolean;
    clientKey: string;
    scriptUrl: string;
}

interface UseMidtransReturn {
    isLoaded: boolean;
    error: string | null;
    config: MidtransConfig | null;
}

/**
 * Custom hook to dynamically load Midtrans Snap.js script
 * Fetches configuration from backend based on environment (sandbox/production)
 */
export function useMidtrans(): UseMidtransReturn {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [config, setConfig] = useState<MidtransConfig | null>(null);

    useEffect(() => {
        let isMounted = true;
        let scriptElement: HTMLScriptElement | null = null;
        let loadTimeout: NodeJS.Timeout;

        async function loadMidtrans() {
            try {
                // Check if already loaded
                if (window.snap) {
                    console.log('✅ Midtrans Snap already loaded');
                    setIsLoaded(true);
                    return;
                }

                // Production Mode Configuration
                // Load client key from environment variable
                const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

                if (!MIDTRANS_CLIENT_KEY) {
                    throw new Error('Missing VITE_MIDTRANS_CLIENT_KEY environment variable');
                }

                // Use Production Snap URL (no sandbox)
                const configData: MidtransConfig = {
                    isProduction: true,
                    clientKey: MIDTRANS_CLIENT_KEY,
                    scriptUrl: 'https://app.midtrans.com/snap/snap.js'
                };

                console.log('✅ Using Production Midtrans config');

                if (!isMounted) return;

                setConfig(configData);
                console.log('✅ Midtrans config loaded:', {
                    environment: configData.isProduction ? 'Production' : 'Sandbox',
                    scriptUrl: configData.scriptUrl
                });

                // Remove any existing Midtrans script
                const existingScript = document.querySelector('script[src*="midtrans.com/snap/snap.js"]');
                if (existingScript) {
                    existingScript.remove();
                    console.log('🗑️ Removed existing Midtrans script');
                }

                // Create and load new script dynamically
                scriptElement = document.createElement('script');
                scriptElement.src = configData.scriptUrl;
                scriptElement.type = 'text/javascript';
                scriptElement.setAttribute('data-client-key', configData.clientKey);

                scriptElement.onload = () => {
                    clearTimeout(loadTimeout);
                    if (isMounted) {
                        console.log('✅ Midtrans Snap.js loaded successfully');
                        setIsLoaded(true);
                        setError(null);
                    }
                };

                scriptElement.onerror = () => {
                    clearTimeout(loadTimeout);
                    if (isMounted) {
                        const errorMsg = 'Failed to load Midtrans Snap.js';
                        console.error('❌', errorMsg);
                        setError(errorMsg);
                        setIsLoaded(false);
                    }
                };

                // Timeout for script loading (reduced for faster feedback)
                loadTimeout = setTimeout(() => {
                    if (!window.snap && isMounted) {
                        console.warn('⚠️ Midtrans script loading timeout');
                        setError('Koneksi lambat. Coba refresh halaman atau gunakan WiFi.');
                        setIsLoaded(false);
                    }
                }, 15000); // 15 seconds timeout (reduced from 20)

                document.head.appendChild(scriptElement);

            } catch (err: any) {
                if (isMounted) {
                    const errorMsg = err.message || 'Failed to initialize Midtrans';
                    console.error('❌ Midtrans initialization error:', err);
                    setError(errorMsg);
                    setIsLoaded(false);
                }
            }
        }

        loadMidtrans();

        // Cleanup function
        return () => {
            isMounted = false;
            if (loadTimeout) {
                clearTimeout(loadTimeout);
            }
            // Note: We don't remove the script on unmount as it might be needed by other components
        };
    }, []);

    return { isLoaded, error, config };
}

// Type declaration for window.snap
declare global {
    interface Window {
        snap: {
            pay: (token: string, options: {
                onSuccess?: (result: any) => void;
                onPending?: (result: any) => void;
                onError?: (result: any) => void;
                onClose?: () => void;
            }) => void;
        };
    }
}
