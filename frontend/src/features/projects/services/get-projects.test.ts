import { describe, expect, it } from "vitest";

import { projectFixture } from "@/features/projects/project.fixture";
import { getProjectsResult } from "@/features/projects/services/get-projects";

describe("getProjectsResult", () => {
  it("returns API data validated by Zod", async () => {
    await expect(getProjectsResult(async () => [projectFixture])).resolves.toEqual({
      status: "success",
      data: [projectFixture],
    });
  });

  it("maps an empty list", async () => {
    await expect(getProjectsResult(async () => [])).resolves.toEqual({ status: "empty" });
  });

  it("maps unavailable and invalid API data safely", async () => {
    await expect(
      getProjectsResult(async () => {
        throw new Error("private API detail");
      }),
    ).resolves.toEqual({ status: "unavailable" });

    await expect(
      getProjectsResult(async () => [{ ...projectFixture, id: "invalid" }]),
    ).resolves.toEqual({ status: "unavailable" });
  });
});
