import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    sourcemap: 'inline',
    hmr: process.env.VITE_HMR_HOST ? {
      host: process.env.VITE_HMR_HOST,
      port: parseInt(process.env.VITE_HMR_PORT || '80'),
      protocol: process.env.VITE_HMR_PROTOCOL || 'ws',
    } : true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path,
      }
    }
  },
  build: {
    sourcemap: false
  },
  define: {
    'process.env': {}
  }
})
