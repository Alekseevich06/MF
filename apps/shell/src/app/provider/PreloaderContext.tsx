import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Preloader } from '@bookhub/preloader';
import { createPreloader } from '@bookhub/preloader';

const PreloaderContext = createContext<Preloader | null>(null);

export function PreloaderProvider({ children }: { children: ReactNode }) {
  const [preloader] = useState(() =>
    createPreloader({ concurrency: 6, defaultTtlMs: 30_000 })
  );

  return (
    <PreloaderContext.Provider value={preloader}>
      {children}
    </PreloaderContext.Provider>
  );
}

export function usePreloader(): Preloader {
  const preloader = useContext(PreloaderContext);
  if (!preloader) {
    throw new Error('usePreloader must be used within <PreloaderProvider>');
  }
  return preloader;
}