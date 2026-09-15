import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'authors',
      manifest: true,
      filename: 'remoteEntry.js',
      exposes: {
        './AuthorsMF': './src/AuthorsMF.tsx',
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
    port: 3002,
    strictPort: true,
    origin: 'http://localhost:3002',
  },
  preview: {
    port: 3002,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'chrome89',
  },
});