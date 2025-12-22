import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false, // Nếu 3000 bận, tự động tìm port khác
    open: false,
    host: true, // Expose ra network
  },
  preview: {
    port: 3000,
  },
});
