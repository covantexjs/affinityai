import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          pdf: ['@react-pdf/renderer'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  envDir: '.',
  server: {
    port: 5173,
    host: '0.0.0.0',
    open: true,
    strictPort: false,
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:8888/.netlify/functions',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/.netlify\/functions/, '')
      }
    }
  }
});