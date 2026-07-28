import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiClientError, apiRequest } from "@/lib/api-client";

describe("apiRequest", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("requests JSON from the configured API without browser caching", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:8000/");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiRequest<{ status: string }>("/health/live")).resolves.toEqual({
      status: "ok",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8000/health/live",
      expect.objectContaining({
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("rejects unsafe API URLs before calling fetch", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "file:///tmp/api");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiRequest("/health/live")).rejects.toMatchObject({
      name: "ApiClientError",
      message: "The backend API URL is invalid.",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("preserves an HTTP status without exposing the response body", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ detail: "private detail" }), {
          status: 500,
        }),
      ),
    );

    const request = apiRequest("/api/v1/portfolio");

    await expect(request).rejects.toBeInstanceOf(ApiClientError);
    await expect(request).rejects.toMatchObject({
      status: 500,
      message: "The backend API returned an error.",
    });
  });

  it("normalizes network and invalid JSON failures", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new Error("socket detail")));

    await expect(apiRequest("/health/live")).rejects.toMatchObject({
      message: "The backend API is unavailable.",
    });

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not-json", { status: 200 })));
    await expect(apiRequest("/health/live")).rejects.toMatchObject({
      message: "The backend API returned an invalid response.",
    });
  });
});
