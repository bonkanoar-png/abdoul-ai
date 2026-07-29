import { describe, expect, it } from "vitest";

import { getProfileResult } from "@/features/profile/services/get-profile";
import { ApiError } from "@/lib/api/errors";
import type { Profile } from "@/types/profile";

const profile = {
  id: "123e4567-e89b-42d3-a456-426614174000",
  name: "Abdoul",
  title: "AI Engineer",
  bio: "Bio",
  location: "France",
  email: "abdoul@example.com",
  github_url: null,
  linkedin_url: null,
  avatar_url: null,
  created_at: "2026-07-01T10:00:00Z",
  updated_at: "2026-07-02T10:00:00Z",
} satisfies Profile;

describe("getProfileResult", () => {
  it("returns validated profile data from the API service", async () => {
    await expect(getProfileResult(async () => profile)).resolves.toEqual({
      status: "success",
      data: profile,
    });
  });

  it("maps a 404 without exposing API details", async () => {
    await expect(
      getProfileResult(async () => {
        throw new ApiError(404, {
          code: "NOT_FOUND",
          message: "Private detail",
          details: null,
        });
      }),
    ).resolves.toEqual({ status: "not-found" });
  });

  it("maps API and unexpected errors to a safe unavailable state", async () => {
    await expect(
      getProfileResult(async () => {
        throw new ApiError(500, {
          code: "INTERNAL_ERROR",
          message: "Private detail",
          details: null,
        });
      }),
    ).resolves.toEqual({ status: "unavailable" });

    await expect(
      getProfileResult(async () => {
        throw new Error("Private detail");
      }),
    ).resolves.toEqual({ status: "unavailable" });
  });
});
