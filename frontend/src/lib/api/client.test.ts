import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";

describe("apiClient", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("gets JSON with the configured headers and cache policy", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com/");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiClient.get("/api/v1/profile")).resolves.toEqual({ status: "ok" });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.com/api/v1/profile",
      expect.objectContaining({
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("exposes a normalized backend API error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: { code: "NOT_FOUND", message: "Profile not found.", details: null },
          }),
          { status: 404 },
        ),
      ),
    );

    await expect(apiClient.get("/api/v1/profile")).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      code: "NOT_FOUND",
      message: "Profile not found.",
      details: null,
    });
  });

  it("normalizes network failures and invalid JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new Error("private socket detail")));
    await expect(apiClient.get("/api/v1/profile")).rejects.toMatchObject({
      code: "API_UNAVAILABLE",
      status: 0,
    });

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("invalid", { status: 200 })));
    await expect(apiClient.get("/api/v1/profile")).rejects.toBeInstanceOf(ApiError);
    await expect(apiClient.get("/api/v1/profile")).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
    });
  });
});
