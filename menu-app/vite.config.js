import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Le backend autorise uniquement le CORS depuis localhost:5173/5174
    // -> on garde un port fixe pour eviter les erreurs CORS.
    strictPort: true,
  },
})
