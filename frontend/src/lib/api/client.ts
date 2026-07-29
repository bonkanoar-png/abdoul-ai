import "server-only";

import { apiErrorResponseSchema } from "@/schemas/api";
import { API_REQUEST_TIMEOUT_MS, ApiUrlConfigurationError, getApiUrl } from "@/lib/api/config";
import { ApiError } from "@/lib/api/errors";

type ApiClient = {
  get<T = unknown>(path: `/${string}`): Promise<T>;
};

async function parseJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throw new ApiError(response.status, {
      code: "INVALID_RESPONSE",
      message: "The backend API returned invalid JSON.",
      details: null,
    });
  }
}

async function get<T = unknown>(path: `/${string}`): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${getApiUrl()}${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(API_REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof ApiUrlConfigurationError) {
      throw new ApiError(0, {
        code: "INVALID_API_URL",
        message: error.message,
        details: null,
      });
    }
    throw new ApiError(0, {
      code: "API_UNAVAILABLE",
      message: "The backend API is unavailable.",
      details: null,
    });
  }

  const payload = await parseJson(response);
  if (!response.ok) {
    const parsedError = apiErrorResponseSchema.safeParse(payload);
    if (parsedError.success) {
      throw new ApiError(response.status, parsedError.data.error);
    }
    throw new ApiError(response.status, {
      code: "HTTP_ERROR",
      message: "The backend API returned an error.",
      details: null,
    });
  }

  return payload as T;
}

export const apiClient: ApiClient = { get };
