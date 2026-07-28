import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiUrlConfigurationError, getApiUrl } from "@/lib/api/config";

describe("getApiUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("normalizes the configured backend origin", () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com/");

    expect(getApiUrl()).toBe("https://api.example.com");
  });

  it("uses the documented local backend when no value is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "");

    expect(getApiUrl()).toBe("http://localhost:8000");
  });

  it("rejects unsupported protocols", () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "file:///tmp/api");

    expect(() => getApiUrl()).toThrow(ApiUrlConfigurationError);
  });
});
