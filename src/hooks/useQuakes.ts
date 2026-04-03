import { useCallback, useEffect, useRef, useState } from 'react';
import { getQuakes, type Quake } from '../api/quakes.api';

const POLL_MS = 60_000;

export function useQuakes() {
  const [quakes, setQuakes] = useState<Quake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await getQuakes();
      setQuakes(data);
      setLastUpdate(new Date());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    timerRef.current = setInterval(load, POLL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [load]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await load();
  }, [load]);

  return { quakes, loading, error, lastUpdate, refresh };
}
