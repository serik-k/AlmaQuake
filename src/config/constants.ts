import Constants from 'expo-constants';

export const ALMATY_COORDS = {
  lat: 43.2565,
  lng: 76.9286,
} as const;

export const SEARCH_CONFIG = {
  radiusKm: 300,
  minMagnitude: 1.0,
  defaultLimit: 50,
  usgsRadiusKm: 100,
} as const;

export const EMERGENCY_CONTACTS = {
  primaryNumber: "112",
} as const;

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? Constants.expoConfig?.extra?.apiUrl ?? '';
