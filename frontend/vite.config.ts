import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0', // Lắng nghe mọi địa chỉ IP (cần cho ngrok)
    port: 5173,       // Port mặc định của Vite (bạn có thể đổi nếu muốn)
    allowedHosts: ['4978-118-70-133-27.ngrok-free.app'],
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend local
        changeOrigin: true,
        secure: false,
      }
    }
  }
})