import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,      // Force it to start on 5173
    strictPort: true // If 5173 is busy, FAIL instead of jumping to 5174
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
})