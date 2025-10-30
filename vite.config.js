import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.', // current directory
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  // This line fixes the 404/missing UI issue on Vercel
  base: './',
})
