import { describe, expect, it } from "vitest";

import { getSkillsResult } from "@/features/skills/services/get-skills";

const skill = {
  id: "123e4567-e89b-42d3-a456-426614174000",
  name: "Python",
  category: "Backend Engineering",
  sort_order: 1,
  created_at: "2026-07-01T10:00:00Z",
  updated_at: "2026-07-02T10:00:00Z",
  level: null,
  icon: null,
};

describe("getSkillsResult", () => {
  it("accepts nullable optional data", async () => {
    await expect(getSkillsResult(async () => [skill])).resolves.toEqual({
      status: "success",
      data: [skill],
    });
  });

  it("maps an empty response", async () => {
    await expect(getSkillsResult(async () => [])).resolves.toEqual({ status: "empty" });
  });

  it("maps invalid data to unavailable", async () => {
    await expect(getSkillsResult(async () => [{ ...skill, category: "" }])).resolves.toEqual({
      status: "unavailable",
    });
  });
});
