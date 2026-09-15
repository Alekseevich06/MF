import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';


const buildVersion = process.env.BUILD_VERSION ?? 'dev';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'catalog',
      manifest: true,
      filename: 'remoteEntry.js',
      exposes: {
        './CatalogMF': './src/CatalogMF.tsx',
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
    port: 3001,
    strictPort: true,
    origin: 'http://localhost:3001',
  },
  preview: {
    port: 3001,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'chrome89',
  },
});