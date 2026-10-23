import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    // En développement, les appels à /api sont redirigés vers l'API Express.
    // Le front peut donc écrire fetch('/api/...') sans se soucier du port.
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  test: {
    // Configuration des tests (Vitest) : on simule un navigateur avec jsdom
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
})
