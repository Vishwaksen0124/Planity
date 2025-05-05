import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 3001,
    proxy:{
      "/api":{
        "target":"https://planity-4l0m.onrender.com",
        "changeOrigin":true,
      },
    },

  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.js', // We'll create this next
  },
})
