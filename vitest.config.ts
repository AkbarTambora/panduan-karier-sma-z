// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path'; // <-- 1. Impor 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  // --- 2. Tambahkan bagian ini ---
  resolve: {
    alias: {
      // Beritahu Vitest bahwa '@' adalah alias untuk direktori 'src'
      '@': path.resolve(__dirname, './src'), 
    },
  },
});