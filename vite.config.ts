import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'app-rewrite',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith('/app/') && !req.url.includes('.')) {
            req.url = '/app/index.html';
          }
          next();
        });
      },
    },
  ],
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),      // Landing Page
        app: resolve(__dirname, 'app/index.html'),   // Aplikasi Member
      },
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        manualChunks: {
          // Split AI SDKs into separate chunks
          'ai-gemini': ['@google/generative-ai', '@google/genai'],
          'ai-openai': ['openai'],
          // Split React and Router
          'react-vendor': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          // Split Supabase
          'supabase': ['@supabase/supabase-js'],
          // Split UI library
          'lucide': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600, // Suppress warning for now
  },
})
