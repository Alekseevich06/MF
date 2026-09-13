import type { PreloadTask, Preloader, PreloaderConfig, PreloaderStats, Priority } from "./preloader.type";

export function createPreloader(config: PreloaderConfig): Preloader {
    const { concurrency, defaultTtlMs = 30_000 } = config;
  
    const cache = new Map<string, { value: unknown; expiresAt: number }>();
    const inflightMap = new Map<string, Promise<unknown>>();
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
      
        // 3. Создаём промис ДО первого await,
        //    чтобы он попал в inflightMap синхронно.
        //    Иначе между двумя конкурентными вызовами
        //    будет окно race condition.
        const promise = (async () => {
          await acquireSlot(task.priority);
          stats.inFlight++;
          try {
            const controller = new AbortController();
            const value = await task.fetch(controller.signal);
            const ttl = task.ttlMs ?? defaultTtlMs;
            cache.set(task.key, { value, expiresAt: Date.now() + ttl });
            return value;
          } catch (error) {
            stats.failed++;
            throw error;
          } finally {
            stats.inFlight--;
            stats.completed++;
            releaseSlot();
          }
        })();
      
        // 4. Кладём в inflightMap сразу
        inflightMap.set(task.key, promise);
      
        // 5. Удаляем после завершения
        promise
          .finally(() => inflightMap.delete(task.key))
          .catch(() => {});
      
        return promise;
      }
  
    return {
      enqueue,
      abort: () => {},   // заглушка
      getStats: () => ({ ...stats }),
      clear: () => {
        cache.clear();
     
        stats.inFlight = 0;
        stats.queued = 0;
        stats.cacheHits = 0;
        stats.dedupHits = 0;
        stats.completed = 0;
        stats.failed = 0;
        queues.critical.length = 0;
queues.high.length = 0;
queues.low.length = 0;
      },
    };
  }