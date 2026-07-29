export const config = {
  almaty: { lat: 43.2565, lng: 76.9286 },
  quake:  { radiusKm: 300, minMagnitude: 2.5, limit: 100 },
  poll:   { intervalMs: 60_000 },
  port:   Number(process.env.PORT) || 3000,
} as const;
