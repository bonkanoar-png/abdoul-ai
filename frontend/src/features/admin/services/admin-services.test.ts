import { describe, expect, it } from "vitest";

import { createMockAdminRepository } from "@/features/admin/services/admin-services";

describe("mock admin repository", () => {
  it("supports create, read, update and delete", async () => {
    const repository = createMockAdminRepository("certifications");
    const created = await repository.create({ name: "Cloud", issuer: "ACME", date: "2026-01-01", credential: "" });
    await expect(repository.getById(created.id)).resolves.toEqual(created);
    await expect(repository.update(created.id, { issuer: "Updated" })).resolves.toMatchObject({ issuer: "Updated" });
    await repository.remove(created.id);
    await expect(repository.getById(created.id)).resolves.toBeNull();
  });
  it("keeps repository instances isolated", async () => {
    const first = createMockAdminRepository("projects"); const second = createMockAdminRepository("projects");
    await first.remove("project-1");
    await expect(first.getAll()).resolves.toHaveLength(0);
    await expect(second.getAll()).resolves.toHaveLength(1);
  });
});

