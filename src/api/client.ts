interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

export class ApiError extends Error {
  public readonly status?: number;
  public readonly code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export async function httpFetch<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { timeoutMs = 12000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...fetchOptions.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new ApiError(`HTTP Error ${response.status}: ${errorText}`, response.status);
    }

    const payload = await response.json();

    // Support standardized backend envelope: { success: true, data: T }
    if (payload && typeof payload === "object" && "success" in payload) {
      if (!payload.success) {
        throw new ApiError(
          payload.error?.message ?? "API operational error",
          response.status,
          payload.error?.code
        );
      }
      return payload.data as T;
    }

    // Direct payload fallback
    return payload as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new ApiError(`Request timeout after ${timeoutMs}ms`, 408, "TIMEOUT");
    }
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err.message ?? "Network error", 500, "NETWORK_ERROR");
  }
}
