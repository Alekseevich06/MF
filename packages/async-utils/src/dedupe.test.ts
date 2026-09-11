import { describe, it, expect, vi } from 'vitest';
import { createDedupe } from './dedupe';

describe('createDedupe', () => {
  it('deduplicates concurrent calls with same key', async () => {
    const dedupe = createDedupe<number>();
    const factory = vi.fn(async () => 42);

    const [a, b, c] = await Promise.all([
      dedupe('x', factory),
      dedupe('x', factory),
      dedupe('x', factory),
    ]);

    expect(factory).toHaveBeenCalledTimes(1);
    expect(a).toBe(42);
    expect(b).toBe(42);
    expect(c).toBe(42);
  });

  it('returns the same Promise instance for same key', () => {
    const dedupe = createDedupe<number>();
    const p1 = dedupe('x', async () => 1);
    const p2 = dedupe('x', async () => 2);
    expect(p1).toBe(p2);
  });

  it('removes key from map after resolution, allowing new call', async () => {
    const dedupe = createDedupe<number>();
    const factory = vi.fn(async () => 42);

    await dedupe('x', factory);
    expect(dedupe.size()).toBe(0);

    await dedupe('x', factory);
    expect(factory).toHaveBeenCalledTimes(2);
  });

  it('different keys run separate factories', async () => {
    const dedupe = createDedupe<string>();
    const factoryA = vi.fn(async () => 'a');
    const factoryB = vi.fn(async () => 'b');
  
    await Promise.all([dedupe('a', factoryA), dedupe('b', factoryB)]);
  
    expect(factoryA).toHaveBeenCalledTimes(1);
    expect(factoryB).toHaveBeenCalledTimes(1);
  });
  
  it('removes key from map after rejection too', async () => {
    const dedupe = createDedupe<number>();
    const failing = vi.fn(async () => {
      throw new Error('boom');
    });
  
    await expect(dedupe('x', failing)).rejects.toThrow('boom');
    expect(dedupe.size()).toBe(0);
  });
  
  it('handles sync throw in factory', async () => {
    const dedupe = createDedupe<number>();
    await expect(
      dedupe('x', () => {
        throw new Error('sync boom');
      })
    ).rejects.toThrow('sync boom');
    expect(dedupe.size()).toBe(0);
  });
  
  it('clear empties the map', async () => {
    const dedupe = createDedupe<number>();
    dedupe('x', () => new Promise(() => {})); // never resolves
    expect(dedupe.size()).toBe(1);
    dedupe.clear();
    expect(dedupe.size()).toBe(0);
  });
});