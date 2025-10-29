import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',              // ensures Vite uses the current directory as the project root
  build: {
    outDir: 'dist',       // Vercel looks for 'dist' by default
    emptyOutDir: true,    // clears old builds before generating a new one
  },
});
