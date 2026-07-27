import "server-only";

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

function getApiBaseUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!configuredUrl) {
    throw new ApiClientError("The backend API URL is not configured.");
  }

  try {
    const url = new URL(configuredUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Unsupported API protocol.");
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    throw new ApiClientError("The backend API URL is invalid.");
  }
}

export async function apiRequest<T>(path: `/${string}`): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
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
