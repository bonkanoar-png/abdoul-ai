import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api/client";
import { getProfile } from "@/lib/api/services/profile";

const profile = {
  id: "123e4567-e89b-42d3-a456-426614174000",
  name: "Abdoul",
  title: "Engineer",
  bio: "Bio",
  location: "Paris",
  email: "abdoul@example.com",
  github_url: null,
  linkedin_url: "https://linkedin.com/in/abdoul",
  avatar_url: null,
  created_at: "2026-07-01T10:00:00Z",
  updated_at: "2026-07-02T10:00:00Z",
};

describe("getProfile", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns a valid profile including nullable optional resources", async () => {
    vi.spyOn(apiClient, "get").mockResolvedValue(profile);

    await expect(getProfile()).resolves.toEqual(profile);
    expect(apiClient.get).toHaveBeenCalledWith("/api/v1/profile");
  });

  it("rejects an invalid backend profile", async () => {
    vi.spyOn(apiClient, "get").mockResolvedValue({ ...profile, id: "not-a-uuid" });

    await expect(getProfile()).rejects.toMatchObject({ name: "ZodError" });
  });
});
