import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiClientError, apiRequest } from "@/lib/api-client";
import { getPortfolio } from "@/features/portfolio/services/get-portfolio";
import type { Portfolio } from "@/types/portfolio";

vi.mock("@/lib/api-client", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/api-client")>();
  return { ...original, apiRequest: vi.fn() };
});

const portfolio = {
  profile: {
    id: "profile-id",
    name: "Abdoul",
    title: "AI Engineer",
    bio: "Portfolio",
    location: "France",
    email: "contact@example.com",
    github_url: null,
    linkedin_url: null,
    avatar_url: null,
    created_at: "2026-07-27T10:30:00Z",
    updated_at: "2026-07-27T10:30:00Z",
  },
  experiences: [],
  projects: [],
  skills: [],
} satisfies Portfolio;

describe("getPortfolio", () => {
  beforeEach(() => {
    vi.mocked(apiRequest).mockReset();
  });

  it("returns portfolio data on success", async () => {
    vi.mocked(apiRequest).mockResolvedValue(portfolio);

    await expect(getPortfolio()).resolves.toEqual({
      status: "success",
      data: portfolio,
    });
    expect(apiRequest).toHaveBeenCalledWith("/api/v1/portfolio");
  });

  it("maps a 404 to the not-found state", async () => {
    vi.mocked(apiRequest).mockRejectedValue(new ApiClientError("Not found", 404));

    await expect(getPortfolio()).resolves.toEqual({ status: "not-found" });
  });

  it("maps API and unexpected errors to the unavailable state", async () => {
    vi.mocked(apiRequest).mockRejectedValueOnce(new ApiClientError("Unavailable", 500));
    await expect(getPortfolio()).resolves.toEqual({ status: "unavailable" });

    vi.mocked(apiRequest).mockRejectedValueOnce(new Error("Unexpected detail"));
    await expect(getPortfolio()).resolves.toEqual({ status: "unavailable" });
  });
});
