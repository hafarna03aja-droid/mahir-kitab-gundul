import React from 'react';

interface PreviewModeWrapperProps {
    children: React.ReactNode;
}

export default function PreviewModeWrapper({ children }: PreviewModeWrapperProps) {
    return (
        <div style={{ position: 'relative' }}>
            {/* Banner Preview Mode */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                backgroundColor: '#fbbf24',
                color: '#78350f',
                padding: '12px 20px',
                textAlign: 'center',
                fontWeight: 'bold',
                zIndex: 9999,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                👁️ MODE PREVIEW - Fitur tidak dapat digunakan.
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        marginLeft: '15px',
                        padding: '6px 16px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '13px'
                    }}
                >
                    Login untuk Akses Penuh
                </button>
            </div>

            {/* Content dengan padding top untuk banner */}
            <div style={{ paddingTop: '60px' }}>
                {children}
            </div>

            {/* Overlay untuk block interaksi */}
            <div
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    alert('⚠️ Fitur ini hanya tersedia setelah login.\n\nSilakan login untuk menggunakan semua fitur aplikasi.');
                }}
                style={{
                    position: 'fixed',
                    top: '60px',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'transparent',
                    zIndex: 9998,
                    cursor: 'not-allowed'
                }}
            />
        </div>
    );
}
