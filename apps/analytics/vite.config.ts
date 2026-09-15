import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'analytics',
      manifest: true,
      filename: 'remoteEntry.js',
      exposes: {
        './AnalyticsMF': './src/AnalyticsMF.tsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        '@bookhub/react-contexts': { singleton: true },
        '@bookhub/shared-ui': { singleton: true },
      },
    }),
  ],
  server: {
    port: 3003,
    strictPort: true,
    origin: 'http://localhost:3003',
  },
  preview: {
    port: 3003,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'chrome89',
  },
});