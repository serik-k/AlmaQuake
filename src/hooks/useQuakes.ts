import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { getQuakes, type Quake } from '../api/quakes.api';

const POLL_MS = 60_000;
const STORAGE_KEY = '@quakes_cache';
const UPDATE_KEY = '@quakes_last_update';

export function useQuakes() {
  const [quakes, setQuakes] = useState<Quake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      setError(null);
      const data = await getQuakes();
      
      setQuakes(data);
      const now = new Date();
      setLastUpdate(now);

      // Cache data
      await AsyncStorage.multiSet([
        [STORAGE_KEY, JSON.stringify(data)],
        [UPDATE_KEY, now.toISOString()],
      ]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize from cache then fetch
  useEffect(() => {
    const init = async () => {
      try {
        const [cached, lastUpd] = await AsyncStorage.multiGet([STORAGE_KEY, UPDATE_KEY]);
        if (cached[1]) setQuakes(JSON.parse(cached[1]));
        if (lastUpd[1]) setLastUpdate(new Date(lastUpd[1]));
      } catch (e) {
        console.warn('[useQuakes] Failed to load cache', e);
      }
      load();
    };

    init();
    timerRef.current = setInterval(() => load(true), POLL_MS);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [load]);

  const refresh = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await load();
  }, [load]);

  return { quakes, loading, error, lastUpdate, refresh };
}
