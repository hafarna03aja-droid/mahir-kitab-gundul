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

        async function loadMidtrans() {
            try {
                // Check if already loaded
                if (window.snap) {
                    console.log('✅ Midtrans Snap already loaded');
                    setIsLoaded(true);
                    return;
                }

                // Fetch Midtrans configuration from backend
                const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://viywfnjhpnunwhakhnrj.supabase.co';
                const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpeXdmbmpocG51bndoYWtobnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxOTgzMTMsImV4cCI6MjA3OTc3NDMxM30._Zj2FGSI7BnZBt6mUvOoJMZXXcUXSLijjPjiNYrTjQo';

                console.log('🔄 Fetching Midtrans configuration...');
                
                const response = await fetch(`${SUPABASE_URL}/functions/v1/midtrans-config`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'apikey': SUPABASE_ANON_KEY
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch Midtrans config: ${response.statusText}`);
                }

                const configData: MidtransConfig = await response.json();
                
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
                    if (isMounted) {
                        console.log('✅ Midtrans Snap.js loaded successfully');
                        setIsLoaded(true);
                        setError(null);
                    }
                };

                scriptElement.onerror = () => {
                    if (isMounted) {
                        const errorMsg = 'Failed to load Midtrans Snap.js';
                        console.error('❌', errorMsg);
                        setError(errorMsg);
                        setIsLoaded(false);
                    }
                };

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
