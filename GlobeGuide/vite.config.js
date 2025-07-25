import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: ['..']
    }
  },
  build: {
    outDir: 'dist'
  },
  base: process.env.VITE_BASE_PATH || '/GlobeGuide',
});
