import type { PreloadTask, Preloader, PreloaderConfig, PreloaderStats, Priority } from "./preloader.type";

function isAbortError(err: unknown): boolean {
    return err instanceof DOMException && err.name === 'AbortError';
  }

export function createPreloader(config: PreloaderConfig): Preloader {
    const { concurrency, defaultTtlMs = 30_000 } = config;
  
    const cache = new Map<string, { value: unknown; expiresAt: number }>();
    const inflightMap = new Map<string, Promise<unknown>>();
    const abortControllers = new Map<string, AbortController>();
    let activeCount = 0;

    const queues: Record<Priority, Array<() => void>> = {
        critical: [],
        high: [],
        low: [],
      };
  
    const stats: PreloaderStats = {
      inFlight: 0,
      queued: 0,
      cacheHits: 0,
      dedupHits: 0,
      completed: 0,
      failed: 0,
      aborted: 0,
    };
  
    async function acquireSlot(priority: Priority): Promise<void> {
        if (activeCount < concurrency) {
          activeCount++;
          return;
        }
        stats.queued++;
        await new Promise<void>((resolve) => queues[priority].push(resolve));
        stats.queued--;
      }

      function releaseSlot(): void {
        const next =
          queues.critical.shift() ??
          queues.high.shift() ??
          queues.low.shift();
      
        if (next) {
          next();
        } else {
          activeCount--;
        }
      }
  
      async function enqueue<T>(task: PreloadTask<T>): Promise<T> {
        // ... cache, inflight — без изменений
      // 1. Кэш
      const cached = cache.get(task.key);
      if (cached && cached.expiresAt > Date.now()) {
        stats.cacheHits++;
        return cached.value as T;
      }
    
      // 2. Inflight (НОВОЕ)
      const existing = inflightMap.get(task.key);
      if (existing) {
        stats.dedupHits++;
        return existing as Promise<T>;
      }

        const promise = (async () => {
          await acquireSlot(task.priority);
          stats.inFlight++;
      
          const controller = new AbortController();
          abortControllers.set(task.key, controller);
      
          try {
            const value = await task.fetch(controller.signal);
            const ttl = task.ttlMs ?? defaultTtlMs;
            cache.set(task.key, { value, expiresAt: Date.now() + ttl });
            stats.completed++;   // ← только при успехе
            return value;
          } catch (error) {
            if (isAbortError(error)) {
              stats.aborted++;
            } else {
              stats.failed++;
            }
            throw error;
          } finally {
            abortControllers.delete(task.key);
            stats.inFlight--;
            releaseSlot();
          }
        })();
      
        inflightMap.set(task.key, promise);
        promise.finally(() => inflightMap.delete(task.key)).catch(() => {});
        return promise;
      }
      
      function abort(key: string): void {
        const controller = abortControllers.get(key);
        if (controller) {
          controller.abort();
        }
      }
  
    return {
      enqueue,
      abort,   // заглушка
      getStats: () => ({ ...stats }),
      clear: () => {
        cache.clear();
        inflightMap.clear();      // ← добавь (у тебя сейчас нет!)
        abortControllers.clear(); 
        stats.inFlight = 0;
        stats.queued = 0;
        stats.cacheHits = 0;
        stats.dedupHits = 0;
        stats.completed = 0;
        stats.failed = 0;
        queues.critical.length = 0;
queues.high.length = 0;
queues.low.length = 0;
stats.aborted = 0;
      },
    };
  }