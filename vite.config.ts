import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/nexus-platform/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
