import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        catalog: {
          type: 'module',
          name: 'catalog',
          entry: 'http://localhost:3001/remoteEntry.js',
          entryGlobalName: 'catalog',
          shareScope: 'default',
        },
        authors: {
          type: 'module',
          name: 'authors',
          entry: 'http://localhost:3002/remoteEntry.js',
          entryGlobalName: 'authors',
          shareScope: 'default',
        },
        analytics: {
          type: 'module',
          name: 'analytics',
          entry: 'http://localhost:3003/remoteEntry.js',
          entryGlobalName: 'analytics',
          shareScope: 'default',
        },
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'chrome89',
  },
});