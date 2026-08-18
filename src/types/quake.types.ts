export interface Quake {
  id: string;
  magnitude: number;
  place: string;
  time: number; // Unix timestamp in milliseconds
  lat: number;
  lng: number;
  depthKm: number;
  distanceKm: number;
}

export type SortOption = "newest" | "magnitude" | "distance";

export interface FilterState {
  minMagnitude: number;
  maxDistanceKm: number;
  sortBy: SortOption;
}

export interface ToastConfig {
  id: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  duration?: number;
}
