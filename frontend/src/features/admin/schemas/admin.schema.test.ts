import { describe, expect, it } from "vitest";

import { experienceAdminSchema, projectAdminSchema } from "@/features/admin/schemas/admin.schema";

describe("admin schemas", () => {
  it("validates an experience form", () => {
    expect(experienceAdminSchema.safeParse({ company: "ACME", role: "Engineer", contractType: "CDI", location: "Paris", dates: "2025", description: "Mission", missions: [], results: [], technologies: ["TS"], skills: [] }).success).toBe(true);
  });
  it("returns field errors for invalid project data", () => {
    const result = projectAdminSchema.safeParse({ title: "", description: "", slug: "Invalid slug", category: "", technologies: [], github: "bad", demo: "", features: [] });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map((issue) => issue.path[0])).toContain("slug");
  });
});

