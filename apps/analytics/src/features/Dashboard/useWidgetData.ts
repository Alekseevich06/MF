// apps/analytics/src/features/Dashboard/useWidgetData.ts
import { useEffect, useState } from 'react';
import { usePreloader } from '@bookhub/react-contexts';

import { isAbortError, type Priority } from '@bookhub/preloader';

interface WidgetConfig<T> {
  key: string;
  priority: Priority;
  ttlMs?: number;
  fetch: (signal: AbortSignal) => Promise<T>;
}

interface WidgetState<T> {
  data: T | null;
  status: 'loading' | 'success' | 'error';
  error: Error | null;
}

export function useWidgetData<T>(config: WidgetConfig<T>): WidgetState<T> {
  const preloader = usePreloader();
  const [state, setState] = useState<WidgetState<T>>({
    data: null,
    status: 'loading',
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    preloader
      .enqueue({
        key: config.key,
        priority: config.priority,
        ttlMs: config.ttlMs,
        fetch: config.fetch,
      })
      .then((data) => {
        if (cancelled) return;
        setState({ data, status: 'success', error: null });
      })
      .catch((err) => {
        if (cancelled || isAbortError(err)) return;
        setState({ data: null, status: 'error', error: err as Error });
      });

    return () => {
      cancelled = true;
    };
  }, [preloader, config.key]);

  return state;
}