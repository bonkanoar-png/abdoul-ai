import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  AdminApiError,
  createAdminApiRepository,
  loginAdmin,
} from "@/features/admin/services/admin-api";

describe("admin API repository", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("creates an experience through the API", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "00000000-0000-0000-0000-000000000001",
          title: "ACME",
          subtitle: "Engineer",
          description: "Build",
          slug: null,
          start_date: "2026-01-01",
          end_date: null,
          url: null,
          category: "CDI",
          is_current: false,
          is_active: true,
          sort_order: 0,
        }),
        { status: 201 },
      ),
    );
    const created = await createAdminApiRepository("experiences").create({
      company: "ACME",
      role: "Engineer",
      contractType: "CDI",
      location: "Paris",
      dates: "2026-01-01",
      description: "Build",
      missions: [],
      results: [],
      technologies: [],
      skills: [],
    });
    expect(created).toMatchObject({ company: "ACME", role: "Engineer" });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/admin/experiences"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("surfaces an expired cookie as a 401", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: { message: "Expired" } }), { status: 401 }),
    );
    await expect(createAdminApiRepository("projects").getAll()).rejects.toEqual(
      expect.objectContaining({ status: 401 }),
    );
  });

  it("delegates login session storage to the HttpOnly cookie", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response(null, { status: 204 }));
    await loginAdmin("admin@example.com", "long-password");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/login"),
      expect.objectContaining({ credentials: "include" }),
    );
    expect(new AdminApiError(403, "Forbidden").status).toBe(403);
  });
});
