const parsePositiveInt = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const parseNonNegativeNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

export const config = {
  almaty: { lat: 43.2565, lng: 76.9286 },
  quake: {
    radiusKm: parsePositiveInt(process.env.QUAKE_RADIUS_KM, 300),
    minMagnitude: parseNonNegativeNumber(process.env.QUAKE_MIN_MAGNITUDE, 2.5),
    limit: parsePositiveInt(process.env.QUAKE_LIMIT, 100),
  },
  poll: {
    intervalMs: parsePositiveInt(process.env.POLL_INTERVAL_MS, 60_000),
  },
  port: parsePositiveInt(process.env.PORT, 3000),
} as const;
