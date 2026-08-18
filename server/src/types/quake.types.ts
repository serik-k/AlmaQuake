export interface Quake {
  id: string;
  magnitude: number;
  place: string;
  time: number; // Unix timestamp in milliseconds
  depthKm: number;
  lat: number;
  lng: number;
  distanceKm: number;
}

export interface QuakeFilterOptions {
  minMagnitude?: number;
  radiusKm?: number;
  limit?: number;
}
