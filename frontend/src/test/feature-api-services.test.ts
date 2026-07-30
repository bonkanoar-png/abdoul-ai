import { afterEach, describe, expect, it, vi } from "vitest";

import { getCertifications } from "@/features/certifications/services/get-certifications";
import { getExperiences } from "@/features/experience/services/get-experiences";
import { getProjects } from "@/features/projects/services/get-projects";
import { projectFixture } from "@/features/projects/project.fixture";
import { getPublications } from "@/features/publications/services/get-publications";
import { getSkills } from "@/features/skills/services/get-skills";
import { apiClient } from "@/lib/api/client";
import {
  certificationFixture,
  experienceFixture,
  publicationFixture,
  skillFixture,
} from "@/test/fixtures";

describe("feature API services", () => {
  afterEach(() => vi.restoreAllMocks());

  it.each([
    ["experiences", getExperiences, "/api/v1/experiences", experienceFixture],
    ["skills", getSkills, "/api/v1/skills", skillFixture],
    ["projects", getProjects, "/api/v1/projects", projectFixture],
    ["publications", getPublications, "/api/v1/publications", publicationFixture],
    ["certifications", getCertifications, "/api/v1/certifications", certificationFixture],
  ] as const)("loads and validates %s through apiClient", async (_name, service, path, fixture) => {
    const get = vi.spyOn(apiClient, "get").mockResolvedValue([fixture]);

    await expect(service()).resolves.toEqual([fixture]);
    expect(get).toHaveBeenCalledWith(path);
  });

  it("propagates network errors and rejects invalid API payloads", async () => {
    vi.spyOn(apiClient, "get").mockRejectedValueOnce(new Error("network"));
    await expect(getProjects()).rejects.toThrow("network");

    vi.spyOn(apiClient, "get").mockResolvedValueOnce([{ ...projectFixture, id: "invalid" }]);
    await expect(getProjects()).rejects.toMatchObject({ name: "ZodError" });
  });
});
