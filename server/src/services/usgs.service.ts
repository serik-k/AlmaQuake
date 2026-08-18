import { config } from "../config";
import { Quake } from "../types/quake.types";
import { haversineKm } from "../utils/geo.utils";
import { logger } from "../utils/logger.utils";

export { Quake };

export async function fetchQuakes(): Promise<Quake[]> {
  const { lat: almatyLat, lng: almatyLng } = config.almaty;
  const { radiusKm, minMagnitude, limit } = config.quake;

  const url = new URL("https://earthquake.usgs.gov/fdsnws/event/1/query");
  url.searchParams.set("format", "geojson");
  url.searchParams.set("latitude", String(almatyLat));
  url.searchParams.set("longitude", String(almatyLng));
  url.searchParams.set("maxradiuskm", String(radiusKm));
  url.searchParams.set("minmagnitude", String(minMagnitude));
  url.searchParams.set("orderby", "time");
  url.searchParams.set("limit", String(limit));

  const urlStr = url.toString();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(urlStr, {
      headers: {
        "User-Agent": "AlmaQuake App (kz.almaquake.app)",
        Accept: "application/json",
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const text = await res.text().catch(() => "N/A");
      logger.error(`USGS HTTP Error: ${res.status} ${res.statusText}. Body: ${text}`);
      throw new Error(`USGS responded with status ${res.status}`);
    }

    const data = (await res.json()) as { features: any[] };

    return (data.features ?? []).map((f: any) => {
      const lat = f.geometry.coordinates[1];
      const lng = f.geometry.coordinates[0];
      return {
        id: f.id,
        magnitude: f.properties.mag,
        place: f.properties.place,
        time: f.properties.time,
        depthKm: f.geometry.coordinates[2],
        lat,
        lng,
        distanceKm: Math.round(haversineKm(almatyLat, almatyLng, lat, lng)),
      };
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      logger.error("USGS request timeout (15s)");
    } else {
      logger.error("Failed to fetch quakes from USGS:", err.message);
    }
    throw err;
  }
}
