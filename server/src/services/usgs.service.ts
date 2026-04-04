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

  // @ts-ignore
  const res  = await fetch(url.toString());
  if (!res.ok) throw new Error(`USGS responded with ${res.status}`);
  const data = await res.json() as { features: any[] };

  return data.features.map((f) => {
    const lat = f.geometry.coordinates[1];
    const lng = f.geometry.coordinates[0];
    return {
      id:         f.id,
      magnitude:  f.properties.mag,
      place:      f.properties.place,
      time:       f.properties.time, // USGS уже отдает в ms
      depthKm:    f.geometry.coordinates[2],
      lat,
      lng,
      distanceKm: Math.round(haversineKm(almatyLat, almatyLng, lat, lng)),
    };
  });
}
