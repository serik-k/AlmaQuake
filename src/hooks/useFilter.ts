import { useMemo, useState } from 'react';
import type { Quake } from '../api/quakes.api';

export type SortKey = 'time' | 'magnitude' | 'distance';
export type MinMag = 1.0 | 2.5 | 3.5 | 5.0;

export function useFilter(quakes: Quake[]) {
  const [sort, setSort] = useState<SortKey>('time');
  const [minMag, setMinMag] = useState<MinMag>(1.0);

  const filtered = useMemo(() => {
    const result = quakes.filter((q) => q.magnitude >= minMag);
    return result.sort((a, b) => {
      if (sort === 'magnitude') return b.magnitude - a.magnitude;
      if (sort === 'distance') return a.distanceKm - b.distanceKm;
      return b.time - a.time;
    });
  }, [quakes, sort, minMag]);

  return { filtered, sort, setSort, minMag, setMinMag };
}
