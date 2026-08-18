import { Quake } from "../types/quake.types";
import { API_BASE_URL, ALMATY_COORDS, SEARCH_CONFIG } from "../config/constants";
import { haversineKm } from "../utils/geo.utils";
import { httpFetch } from "./client";

export { Quake };

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
        distanceKm: Math.round(haversineKm(ALMATY_COORDS.lat, ALMATY_COORDS.lng, lat, lng)),
      };
    })
    .filter((q) => q.distanceKm <= SEARCH_CONFIG.usgsRadiusKm && q.magnitude >= SEARCH_CONFIG.minMagnitude)
    .sort((a, b) => b.time - a.time)
    .slice(0, SEARCH_CONFIG.defaultLimit);
}

async function fetchFromUSGS(): Promise<Quake[]> {
  const now = Date.now();
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const url =
    `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson` +
    `&starttime=${weekAgo}` +
    `&latitude=${ALMATY_COORDS.lat}&longitude=${ALMATY_COORDS.lng}` +
    `&maxradiuskm=${SEARCH_CONFIG.usgsRadiusKm}` +
    `&minmagnitude=${SEARCH_CONFIG.minMagnitude}` +
    `&orderby=time&limit=${SEARCH_CONFIG.defaultLimit}`;

  const data = await httpFetch<{ features: any[] }>(url);
  return parseUSGSFeatures(data.features ?? []);
}

async function fetchFromBackend(): Promise<Quake[]> {
  return httpFetch<Quake[]>(`${API_BASE_URL}/api/quakes`);
}

export async function getQuakes(): Promise<Quake[]> {
  if (API_BASE_URL) {
    try {
      return await fetchFromBackend();
    } catch {
      // Fall through seamlessly to direct USGS query on backend error
    }
  }
  return fetchFromUSGS();
}

export async function registerToken(token: string): Promise<void> {
  if (!API_BASE_URL) return;
  await httpFetch(`${API_BASE_URL}/api/register`, {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}
