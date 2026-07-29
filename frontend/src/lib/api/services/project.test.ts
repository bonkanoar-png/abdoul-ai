import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api/client";
import { getProjects } from "@/lib/api/services/project";

const project = {
  id: "123e4567-e89b-42d3-a456-426614174001",
  profile_id: "123e4567-e89b-42d3-a456-426614174000",
  slug: "abdoul-ai",
  title: "Abdoul AI",
  description: "Description",
  content: "Content",
  github_url: "https://github.com/example/abdoul-ai",
  demo_url: null,
  image_url: null,
  is_featured: true,
  sort_order: 1,
  created_at: "2026-07-01T10:00:00Z",
  updated_at: "2026-07-02T10:00:00Z",
  technologies: [
    {
      id: "123e4567-e89b-42d3-a456-426614174002",
      name: "TypeScript",
      category: "Language",
      icon_url: null,
      sort_order: 1,
      created_at: "2026-07-01T10:00:00Z",
      updated_at: "2026-07-02T10:00:00Z",
    },
  ],
};

describe("getProjects", () => {
  afterEach(() => vi.restoreAllMocks());

  it("validates nested technologies and nullable URLs", async () => {
    vi.spyOn(apiClient, "get").mockResolvedValue([project]);

    await expect(getProjects()).resolves.toEqual([project]);
  });

  it("rejects invalid nested project data", async () => {
    vi.spyOn(apiClient, "get").mockResolvedValue([
      { ...project, technologies: [{ ...project.technologies[0], icon_url: "not-a-url" }] },
    ]);

    await expect(getProjects()).rejects.toMatchObject({ name: "ZodError" });
  });
});
