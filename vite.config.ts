import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'API_', 'SUPABASE_', 'GOOGLE_'],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-icons': ['lucide-react'],
          'vendor-qr': ['html5-qrcode', 'qrcode.react', 'jsbarcode'],
        },
      },
    },
  },
});

