export interface Dedupe<T> {
    (key: string, factory: () => Promise<T>): Promise<T>;
    clear(): void;
    size(): number;
  }
  
  export function createDedupe<T>(): Dedupe<T> {
    const inflight = new Map<string, Promise<T>>();
  
    const dedupe = (key: string, factory: () => Promise<T>): Promise<T> => {
        // 1. Если key в inflight — вернуть существующий промис
        const isYesKey = inflight.get(key)
        if(isYesKey) return isYesKey

          // 2. Иначе — обернуть factory в Promise.resolve().then(factory)
        const newPromise = Promise.resolve().then(factory)

          // 3. Положить в inflight
        inflight.set(key, newPromise)


        // 4. Подписаться на finally с удалением из Map (с .catch(() => {}) для unhandled rejection)
        newPromise.finally(() => inflight.delete(key)).catch(() => {})
        
        // 5. Вернуть исходный промис p

        return newPromise
    };
  
    dedupe.clear = () => inflight.clear();
    dedupe.size = () => inflight.size;
  
    return dedupe;
  }