import { config } from "../config";
// @ts-ignore
import fetch from "node-fetch";

export interface Quake {
  id:         string;
  magnitude:  number;
  place:      string;
  time:       number; // unix ms
  depthKm:    number;
  lat:        number;
  lng:        number;
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

export async function fetchQuakes(): Promise<Quake[]> {
  const { lat: almatyLat, lng: almatyLng } = config.almaty;
  const { radiusKm, minMagnitude, limit } = config.quake;

  const url = new URL("https://earthquake.usgs.gov/fdsnws/event/1/query");
  url.searchParams.set("format",         "geojson");
  url.searchParams.set("latitude",       String(almatyLat));
  url.searchParams.set("longitude",      String(almatyLng));
  url.searchParams.set("maxradiuskm",    String(radiusKm));
  url.searchParams.set("minmagnitude",   String(minMagnitude));
  url.searchParams.set("orderby",        "time");
  url.searchParams.set("limit",          String(limit));

  const urlStr = url.toString();
  console.log(`🌐 Запрос к USGS: ${urlStr}`);

  try {
    // @ts-ignore
    const res = await fetch(urlStr, {
      headers: { 
        "User-Agent": "AlmaQuake App (kz.almaquake.app)",
        "Accept": "application/json"
      },
      timeout: 15000 // 15 секунд таймаут
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "N/A");
      console.error(`❌ USGS ошибка: ${res.status} ${res.statusText}. Тело: ${text}`);
      throw new Error(`USGS responded with ${res.status}`);
    }

    const data = await res.json() as { features: any[] };
    console.log(`✅ USGS данные получены. Событий: ${data.features?.length ?? 0}`);

    return (data.features ?? []).map((f: any) => {
      const lat = f.geometry.coordinates[1];
      const lng = f.geometry.coordinates[0];
      return {
        id:         f.id,
        magnitude:  f.properties.mag,
        place:      f.properties.place,
        time:       f.properties.time,
        depthKm:    f.geometry.coordinates[2],
        lat,
        lng,
        distanceKm: Math.round(haversineKm(almatyLat, almatyLng, lat, lng)),
      };
    });
  } catch (err: any) {
    if (err.name === 'FetchError' && err.type === 'request-timeout') {
      console.error("⏱️ Тайм-аут запроса к USGS (15с)");
    } else {
      console.error("❌ Ошибка при запросе к USGS:", err.message);
    }
    throw err;
  }
}
