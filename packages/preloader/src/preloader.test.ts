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
});