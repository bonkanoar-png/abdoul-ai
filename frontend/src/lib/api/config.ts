const DEFAULT_API_URL = "http://localhost:8000";

export class ApiUrlConfigurationError extends Error {
  constructor() {
    super("The backend API URL is invalid.");
    this.name = "ApiUrlConfigurationError";
  }
}

export function getApiUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || DEFAULT_API_URL;

  try {
    const url = new URL(configuredUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new ApiUrlConfigurationError();
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    throw new ApiUrlConfigurationError();
  }
}
