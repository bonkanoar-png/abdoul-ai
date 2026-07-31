import { describe, expect, it } from "vitest";

import {
  getExperiencesResult,
  getPortfolioExperiences,
} from "@/features/experience/services/get-experiences";

const experience = {
  id: "123e4567-e89b-42d3-a456-426614174000",
  profile_id: "123e4567-e89b-42d3-a456-426614174001",
  company: "Orange SA",
  role: "Data Analyst",
  description: "Analyse de données.",
  start_date: "2024-01-01",
  end_date: null,
  is_current: true,
  sort_order: 1,
  created_at: "2026-07-01T10:00:00Z",
  updated_at: "2026-07-02T10:00:00Z",
};

describe("getExperiencesResult", () => {
  it("loads the four validated portfolio experiences by default", async () => {
    await expect(getPortfolioExperiences()).resolves.toHaveLength(4);
    await expect(getExperiencesResult()).resolves.toMatchObject({ status: "success" });
  });

  it("returns validated experience data", async () => {
    await expect(getExperiencesResult(async () => [experience])).resolves.toEqual({
      status: "success",
      data: [experience],
    });
  });

  it("maps an empty response", async () => {
    await expect(getExperiencesResult(async () => [])).resolves.toEqual({ status: "empty" });
  });

  it("maps API failures and invalid Zod data to unavailable", async () => {
    await expect(
      getExperiencesResult(async () => {
        throw new Error("API detail");
      }),
    ).resolves.toEqual({ status: "unavailable" });

    await expect(
      getExperiencesResult(async () => [{ ...experience, id: "invalid" }]),
    ).resolves.toEqual({ status: "unavailable" });
  });
});
