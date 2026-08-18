import { API_BASE_URL } from "../config/constants";
import { httpFetch } from "./client";

export async function registerDeviceToken(token: string): Promise<{ registered: boolean }> {
  if (!API_BASE_URL) {
    return { registered: false };
  }
  return httpFetch<{ registered: boolean }>(`${API_BASE_URL}/api/register`, {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function unregisterDeviceToken(token: string): Promise<{ unregistered: boolean }> {
  if (!API_BASE_URL) {
    return { unregistered: false };
  }
  return httpFetch<{ unregistered: boolean }>(`${API_BASE_URL}/api/register`, {
    method: "DELETE",
    body: JSON.stringify({ token }),
  });
}
