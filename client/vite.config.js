import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import html from 'vite-plugin-html';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    html({
      inject: {
        injectData: {
          kcUrl: process.env.KC_URL
        }
      }
    })
  ],
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});