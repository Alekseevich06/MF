import type { PreloadTask, Preloader, PreloaderConfig, PreloaderStats } from "./preloader.type";

export function createPreloader(config: PreloaderConfig): Preloader {
    const { concurrency, defaultTtlMs = 30_000 } = config;
  
    const cache = new Map<string, { value: unknown; expiresAt: number }>();
    const queue: Array<() => void> = [];   // функции, которые ждут слота
    let activeCount = 0;
  
    const stats: PreloaderStats = {
      inFlight: 0,
      queued: 0,
      cacheHits: 0,
      dedupHits: 0,
      completed: 0,
      failed: 0,
    };
  
    async function acquireSlot(): Promise<void> {
        if (activeCount < concurrency) {
          activeCount++;
          return;
        }
        stats.queued++;
        await new Promise<void>((resolve) => queue.push(resolve));
        stats.queued--;
      }
    function releaseSlot(): void {
        const next = queue.shift();
        if (next) {
          // Передаём слот ожидающему — activeCount не меняется
          next();
        } else {
          // Очередь пуста — освобождаем слот
          activeCount--;
        }
      }
  
    async function enqueue<T>(task: PreloadTask<T>): Promise<T> {
      // 1. Проверить cache
      const cacheTask = cache.get(task.key)
      if(cacheTask && cacheTask.expiresAt > Date.now()) {
        stats.cacheHits++
        return cacheTask.value as T
      }
      // 2. Проверить inflight (пока пропусти, будет в итерации 3)
      // 3. await acquireSlot()
      await acquireSlot()
      stats.inFlight++;
      // 4. activeCount++, stats.inFlight++
      // 5. try { const value = await task.fetch(...); cache.set(...); return value }
      //    catch { stats.failed++; throw }
      //    finally { releaseSlot(); stats.completed++; stats.inFlight-- }
      try {
        const controller = new AbortController();
        const value = await task.fetch(controller.signal)

        const ttl = task.ttlMs ?? defaultTtlMs;
        cache.set(task.key, { value, expiresAt: Date.now() + ttl });

    return value;
      } catch (error) {
        stats.failed++; 
        throw error
      } finally {
        releaseSlot(); 
        stats.completed++; 
        stats.inFlight-- 
      }
    }
  
    return {
      enqueue,
      abort: () => {},   // заглушка
      getStats: () => ({ ...stats }),
      clear: () => {
        cache.clear();
        queue.length = 0;
        stats.inFlight = 0;
        stats.queued = 0;
        stats.cacheHits = 0;
        stats.dedupHits = 0;
        stats.completed = 0;
        stats.failed = 0;
      },
    };
  }