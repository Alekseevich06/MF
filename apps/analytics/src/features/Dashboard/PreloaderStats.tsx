import { useEffect, useState } from 'react';
import { usePreloader } from '@bookhub/react-contexts';

export function PreloaderStats() {
  const preloader = usePreloader();
  const [stats, setStats] = useState(preloader.getStats());

  useEffect(() => {
    const id = setInterval(() => {
      setStats(preloader.getStats());
    }, 300);
    return () => clearInterval(id);
  }, [preloader]);

  return (
    <div className="stats-panel">
      <strong>Preloader Stats</strong>
      <div style={{ marginTop: 6 }}>
        <span>in-flight: {stats.inFlight}</span>
        <span>queued: {stats.queued}</span>
        <span>cacheHits: {stats.cacheHits}</span>
        <span>dedupHits: {stats.dedupHits}</span>
        <span>completed: {stats.completed}</span>
        <span>failed: {stats.failed}</span>
        <span>aborted: {stats.aborted}</span>
      </div>
    </div>
  );
}