export async function mapWithLimit<T, R>(
    items: readonly T[],
    limit: number,
    worker: (item: T, index: number) => Promise<R>
  ): Promise<R[]> {
    if (limit < 1) throw new RangeError('limit must be >= 1');
    if (items.length === 0) return [];
  
    const results = new Array<R>(items.length);
    let nextIndex = 0;
    let aborted = false;
    let firstError: unknown = null;
  
    async function runWorker(): Promise<void> {
      while (true) {
        // 1. Проверить aborted — если да, выйти
        if(aborted) return

        // 2. Взять currentIndex = nextIndex++ (атомарно!)
        const currentIndex = nextIndex++
        // 3. Если currentIndex >= items.length — выйти
        if(currentIndex >= items.length) return
        // 4. try { await worker(...); если aborted — return; results[i] = value }
        //    catch (err) { если !aborted — aborted = true, firstError = err; return }

        try {
            const value = await worker(items[currentIndex], currentIndex);
            if (aborted) return;
            results[currentIndex] = value;
            

        } catch (error) {

            if (!aborted) {
                aborted = true;
                firstError = error;
              }
              return;
        }
      }
    }
  
    const workerCount = Math.min(limit, items.length);
    const workers = Array.from({ length: workerCount }, () => runWorker());
    await Promise.all(workers);
  
    if (aborted) throw firstError;
    return results;
  }