import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000
  },
  preview: {
    host: true,
    port: 3000
  },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          'lucide-icons': ['lucide-react']
        }
      }
    }
  },
  // Define environment variables
  define: {
    'process.env.VITE_AZURE_API_URL': JSON.stringify(process.env.VITE_AZURE_API_URL),
    'process.env.VITE_AZURE_API_KEY': JSON.stringify(process.env.VITE_AZURE_API_KEY)
  }
});