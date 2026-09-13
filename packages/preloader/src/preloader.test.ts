import { describe, it, expect, vi } from 'vitest';
import { createPreloader } from './preloader';

const makeTask = <T>(key: string, fetch: (signal: AbortSignal) => Promise<T>, priority: 'critical'|'high'|'low' = 'high') => ({
  key, priority, fetch,
});

describe('preloader (iteration 1)', () => {
  it('never exceeds concurrency limit', async () => {
    const preloader = createPreloader({ concurrency: 2 });
    let active = 0, max = 0;
    const fetch = async () => {
      active++; max = Math.max(max, active);
      await new Promise((r) => setTimeout(r, 10));
      active--;
    };
    await Promise.all(Array.from({ length: 10 }, (_, i) =>
      preloader.enqueue(makeTask(`k${i}`, fetch))
    ));
    expect(max).toBe(2);
  });

  it('cache hit does not call fetch twice', async () => {
    const preloader = createPreloader({ concurrency: 4 });
    const fetch = vi.fn(async () => 42);
    await preloader.enqueue(makeTask('x', fetch));
    await preloader.enqueue(makeTask('x', fetch));
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(preloader.getStats().cacheHits).toBe(1);
  });

  it('cache expires after TTL', async () => {
    const preloader = createPreloader({ concurrency: 4, defaultTtlMs: 20 });
    const fetch = vi.fn(async () => 42);
    await preloader.enqueue(makeTask('x', fetch));
    await new Promise((r) => setTimeout(r, 30));
    await preloader.enqueue(makeTask('x', fetch));
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('clear resets cache and stats', async () => {
    const preloader = createPreloader({ concurrency: 4 });
    await preloader.enqueue(makeTask('x', async () => 1));
    preloader.clear();
    expect(preloader.getStats().completed).toBe(0);
    const fetch = vi.fn(async () => 2);
    await preloader.enqueue(makeTask('x', fetch));  // нет cache hit
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('stats count completed and in-flight correctly', async () => {
    const preloader = createPreloader({ concurrency: 2 });
    await Promise.all([
      preloader.enqueue(makeTask('a', async () => 1)),
      preloader.enqueue(makeTask('b', async () => 2)),
      preloader.enqueue(makeTask('c', async () => 3)),
    ]);
    const s = preloader.getStats();
    expect(s.completed).toBe(3);
    expect(s.inFlight).toBe(0);
    expect(s.queued).toBe(0);
  });
  it('critical tasks run before low tasks (when queued)', async () => {
    const preloader = createPreloader({ concurrency: 1 });
    const order: string[] = [];
  
    // Занимаем единственный слот долгой задачей
    const blocker = preloader.enqueue({
      key: 'blocker',
      priority: 'high',
      fetch: async () => {
        await new Promise((r) => setTimeout(r, 50));
        order.push('blocker');
        return 'blocker';
      },
    });
  
    // Ставим в очередь low, потом critical
    const low = preloader.enqueue({
      key: 'low',
      priority: 'low',
      fetch: async () => { order.push('low'); return 'low'; },
    });
    const critical = preloader.enqueue({
      key: 'critical',
      priority: 'critical',
      fetch: async () => { order.push('critical'); return 'critical'; },
    });
  
    await Promise.all([blocker, low, critical]);
  
    // Ожидаем: blocker (уже стартовал), потом critical (обогнал low), потом low
    expect(order).toEqual(['blocker', 'critical', 'low']);
  });
  
  it('high priority between critical and low', async () => {
    const preloader = createPreloader({ concurrency: 1 });
    const order: string[] = [];
  
    const blocker = preloader.enqueue({
      key: 'b', priority: 'high',
      fetch: async () => { await new Promise((r) => setTimeout(r, 50)); return 'b'; },
    });
  
    const low = preloader.enqueue({ key: 'l', priority: 'low', fetch: async () => { order.push('low'); return 'l'; } });
    const high = preloader.enqueue({ key: 'h', priority: 'high', fetch: async () => { order.push('high'); return 'h'; } });
    const critical = preloader.enqueue({ key: 'c', priority: 'critical', fetch: async () => { order.push('critical'); return 'c'; } });
  
    await Promise.all([blocker, low, high, critical]);
  
    expect(order).toEqual(['critical', 'high', 'low']);
  });
  
  it('clear empties all three queues', async () => {
    const preloader = createPreloader({ concurrency: 1 });
  
    // Занимаем слот
    preloader.enqueue({ key: 'b', priority: 'high', fetch: () => new Promise(() => {}) });
  
    preloader.enqueue({ key: 'c1', priority: 'critical', fetch: async () => 1 });
    preloader.enqueue({ key: 'h1', priority: 'high', fetch: async () => 2 });
    preloader.enqueue({ key: 'l1', priority: 'low', fetch: async () => 3 });
  
    expect(preloader.getStats().queued).toBe(3);
    preloader.clear();
    expect(preloader.getStats().queued).toBe(0);
  });
  it('dedupes concurrent calls with same key', async () => {
    const preloader = createPreloader({ concurrency: 4 });
    const fetch = vi.fn(async () => {
      await new Promise((r) => setTimeout(r, 20));
      return 42;
    });
  
    const [a, b, c] = await Promise.all([
      preloader.enqueue({ key: 'x', priority: 'high', fetch }),
      preloader.enqueue({ key: 'x', priority: 'high', fetch }),
      preloader.enqueue({ key: 'x', priority: 'high', fetch }),
    ]);
  
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(a).toBe(42);
    expect(b).toBe(42);
    expect(c).toBe(42);
    expect(preloader.getStats().dedupHits).toBe(2);
    expect(preloader.getStats().completed).toBe(1);
  });
  
  it('removes key from inflight after completion', async () => {
    const preloader = createPreloader({ concurrency: 4 });
    const fetch = vi.fn(async () => 42);
  
    await preloader.enqueue({ key: 'x', priority: 'high', fetch });
    await preloader.enqueue({ key: 'x', priority: 'high', fetch });
  
    // Второй вызов должен пойти из cache (не из inflight), поэтому fetch всё ещё 1
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(preloader.getStats().cacheHits).toBe(1);
    expect(preloader.getStats().dedupHits).toBe(0);
  });
  
  it('different keys run separate fetches', async () => {
    const preloader = createPreloader({ concurrency: 4 });
    const fetchA = vi.fn(async () => 'a');
    const fetchB = vi.fn(async () => 'b');
  
    await Promise.all([
      preloader.enqueue({ key: 'a', priority: 'high', fetch: fetchA }),
      preloader.enqueue({ key: 'b', priority: 'high', fetch: fetchB }),
    ]);
  
    expect(fetchA).toHaveBeenCalledTimes(1);
    expect(fetchB).toHaveBeenCalledTimes(1);
    expect(preloader.getStats().dedupHits).toBe(0);
  });
  
  it('dedupe does not consume extra concurrency slot', async () => {
    const preloader = createPreloader({ concurrency: 1 });
    let active = 0;
    let max = 0;
    const fetch = async () => {
      active++; max = Math.max(max, active);
      await new Promise((r) => setTimeout(r, 20));
      active--;
      return 1;
    };
  
    await Promise.all([
      preloader.enqueue({ key: 'x', priority: 'high', fetch }),
      preloader.enqueue({ key: 'x', priority: 'high', fetch }),
      preloader.enqueue({ key: 'x', priority: 'high', fetch }),
    ]);
  
    expect(max).toBe(1);
  });
  it('abort cancels in-flight request', async () => {
    const preloader = createPreloader({ concurrency: 4 });
    let receivedSignal: AbortSignal | null = null;
  
    const fetch = (signal: AbortSignal) => {
      receivedSignal = signal;
      return new Promise((_, reject) => {
        signal.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'));
        });
      });
    };
  
    const p = preloader.enqueue({ key: 'x', priority: 'high', fetch });
    // Даём время на регистрацию signal
    await new Promise((r) => setTimeout(r, 0));
  
    preloader.abort('x');
  
    await expect(p).rejects.toThrow(/abort/i);
    expect(preloader.getStats().aborted).toBe(1);
    expect(preloader.getStats().failed).toBe(0);
  });
  
  it('abort on unknown key is no-op', () => {
    const preloader = createPreloader({ concurrency: 4 });
    expect(() => preloader.abort('nonexistent')).not.toThrow();
  });
  
  it('abort removes controller from map', async () => {
    const preloader = createPreloader({ concurrency: 4 });
    const fetch = (signal: AbortSignal) =>
      new Promise<number>((_, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      });
  
    const p = preloader.enqueue({ key: 'x', priority: 'high', fetch });
    await new Promise((r) => setTimeout(r, 0));
    preloader.abort('x');
    await expect(p).rejects.toThrow();
  
    // Повторный abort — no-op
    expect(() => preloader.abort('x')).not.toThrow();
  });
  
  it('aborted request does not go into cache', async () => {
    const preloader = createPreloader({ concurrency: 4 });
    const fetch = (signal: AbortSignal) =>
      new Promise<number>((_, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      });
  
    const p = preloader.enqueue({ key: 'x', priority: 'high', fetch });
    await new Promise((r) => setTimeout(r, 0));
    preloader.abort('x');
    await expect(p).rejects.toThrow();
  
    // Новый вызов должен снова пойти в fetch
    const goodFetch = vi.fn(async () => 42);
    await preloader.enqueue({ key: 'x', priority: 'high', fetch: goodFetch });
    expect(goodFetch).toHaveBeenCalledTimes(1);
  });
});