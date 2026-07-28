import "server-only";

import { ApiUrlConfigurationError, getApiUrl } from "@/lib/api/config";

const REQUEST_TIMEOUT_MS = 5_000;

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export async function apiRequest<T>(path: `/${string}`): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${getApiUrl()}${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof ApiUrlConfigurationError) {
      throw new ApiClientError(error.message);
    }
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError("The backend API is unavailable.");
  }

  if (!response.ok) {
    throw new ApiClientError("The backend API returned an error.", response.status);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiClientError("The backend API returned an invalid response.");
  }
}
