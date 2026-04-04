// Almaty coordinates
const ALMATY_LAT = 43.2565;
const ALMATY_LNG = 76.9286;
const RADIUS_KM = 100;
const MIN_MAG = 1.0;
const LIMIT = 20;

// Base URL — set EXPO_PUBLIC_API_URL in .env to point at your backend.
// Falls back to querying USGS directly.
const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? '';

export interface Quake {
  id: string;
  magnitude: number;
  place: string;
  time: number;       // unix ms
  lat: number;
  lng: number;
  depthKm: number;
  distanceKm: number;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseUSGSFeatures(features: any[]): Quake[] {
  return features
    .map((f: any) => {
      const [lng, lat, depth] = f.geometry.coordinates as number[];
      return {
        id: f.id as string,
        magnitude: f.properties.mag as number,
        place: f.properties.place as string,
        time: f.properties.time as number,
        lat,
        lng,
        depthKm: depth,
        distanceKm: Math.round(haversineKm(ALMATY_LAT, ALMATY_LNG, lat, lng)),
      };
    })
    .filter((q) => q.distanceKm <= RADIUS_KM && q.magnitude >= MIN_MAG)
    .sort((a, b) => b.time - a.time)
    .slice(0, LIMIT);
}

async function fetchFromUSGS(): Promise<Quake[]> {
  const now = Date.now();
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const url =
    `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson` +
    `&starttime=${weekAgo}` +
    `&latitude=${ALMATY_LAT}&longitude=${ALMATY_LNG}` +
    `&maxradiuskm=${RADIUS_KM}` +
    `&minmagnitude=${MIN_MAG}` +
    `&orderby=time&limit=${LIMIT}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`USGS ${res.status}`);
  const data = await res.json();
  return parseUSGSFeatures(data.features ?? []);
}

async function fetchFromBackend(): Promise<Quake[]> {
  const res = await fetch(`${API_BASE}/api/quakes`);
  if (!res.ok) throw new Error(`Backend ${res.status}`);
  return res.json();
}

export async function getQuakes(): Promise<Quake[]> {
  if (API_BASE) {
    try {
      return await fetchFromBackend();
    } catch {
      // fall through to USGS
    }
  }
  return fetchFromUSGS();
}

export async function registerToken(token: string): Promise<void> {
  if (!API_BASE) return;
  await fetch(`${API_BASE}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
}
