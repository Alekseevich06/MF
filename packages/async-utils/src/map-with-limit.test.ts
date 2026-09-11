import { describe, it, expect } from 'vitest';
import { mapWithLimit } from './map-with-limit';

describe('mapWithLimit', () => {
  it('returns [] for empty items without calling worker', async () => {
    let called = 0;
    const result = await mapWithLimit([], 3, async () => {
      called++;
      return 0;
    });
    expect(result).toEqual([]);
    expect(called).toBe(0);
  });

  it('throws RangeError for limit < 1', async () => {
    await expect(mapWithLimit([1], 0, async (x) => x)).rejects.toThrow(RangeError);
    await expect(mapWithLimit([1], -1, async (x) => x)).rejects.toThrow(RangeError);
  });

  it('never exceeds concurrency limit', async () => {
    let active = 0;
    let maxActive = 0;

    const worker = async () => {
      active++;
      maxActive = Math.max(maxActive, active);
      await new Promise((r) => setTimeout(r, 10));
      active--;
    };

    await mapWithLimit([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3, worker);
    expect(maxActive).toBe(3);
  });

  it('preserves order despite out-of-order completion', async () => {
    const delays = [50, 10, 30, 5];
    const worker = async (_: unknown, i: number) => {
      await new Promise((r) => setTimeout(r, delays[i]));
      return i;
    };

    const result = await mapWithLimit([0, 1, 2, 3], 4, worker);
    expect(result).toEqual([0, 1, 2, 3]);
  });

  it('starts next task as soon as a slot frees (sliding window)', async () => {
    const startTimes: Array<[number, number]> = [];
    const worker = async (n: number) => {
      startTimes.push([n, Date.now()]);
      await new Promise((r) => setTimeout(r, n === 1 ? 50 : 5));
    };

    await mapWithLimit([0, 1, 2], 2, worker);

    const t0 = startTimes.find(([n]) => n === 0)![1];
    const t2 = startTimes.find(([n]) => n === 2)![1];
    // task 2 должен стартовать быстро (после task 0), не дожидаясь task 1
    expect(t2 - t0).toBeLessThan(30);
  });

  it('fail-fast rejects with first error and stops starting new tasks', async () => {
    let started = 0;
    const worker = async (x: number) => {
      started++;
      if (x === 2) throw new Error('boom');
      await new Promise((r) => setTimeout(r, 20));
      return x;
    };

    await expect(mapWithLimit([1, 2, 3, 4, 5], 2, worker)).rejects.toThrow('boom');
    // После ошибки стартовало не больше 3 (2 в работе + возможно 1 взятый)
    expect(started).toBeLessThanOrEqual(3);
  });

  it('limit greater than items.length still works', async () => {
    const result = await mapWithLimit([1, 2], 10, async (x) => x * 2);
    expect(result).toEqual([2, 4]);
  });

  it('passes correct index to worker', async () => {
    const result = await mapWithLimit(['a', 'b', 'c'], 2, async (_, i) => i);
    expect(result).toEqual([0, 1, 2]);
  });
});