import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '83cc-2600-1700-4a3f-7c00-a961-7873-19f6-b0fa.ngrok-free.app'
    ],
  },
})
