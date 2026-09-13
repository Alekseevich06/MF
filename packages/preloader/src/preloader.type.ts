export type Priority = 'critical' | 'high' | 'low';

export interface PreloadTask<T> {
  key: string;                        // уникальный ключ (для дедупликации и кэша)
  priority: Priority;
  fetch: (signal: AbortSignal) => Promise<T>;
  ttlMs?: number;                     // время жизни кэша, default 30_000 (30 секунд)
}

export interface PreloaderConfig {
  concurrency: number;                // общий лимит одновременных запросов
  defaultTtlMs?: number;              // default TTL для всех задач
}

export interface PreloaderStats {
  inFlight: number;                   // сейчас в полёте
  queued: number;                     // в очереди на запуск
  cacheHits: number;                  // отдано из кэша
  dedupHits: number;                  // присоединились к чужому запросу
  completed: number;                  // успешно завершено
  failed: number;  
  aborted: number;                   
}

export interface Preloader {
  enqueue<T>(task: PreloadTask<T>): Promise<T>;
  abort(key: string): void;
  getStats(): PreloaderStats;
  clear(): void;
}