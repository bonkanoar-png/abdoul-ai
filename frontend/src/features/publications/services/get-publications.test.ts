import { describe, expect, it } from "vitest";

import { getPublicationsResult } from "@/features/publications/services/get-publications";

const publication = {
  id: "123e4567-e89b-42d3-a456-426614174001",
  title: "Publication",
  slug: "publication",
  summary: "Résumé",
  content: "Contenu",
  published_at: "2026-07-01T10:00:00Z",
  url: null,
  tags: null,
};

describe("getPublicationsResult", () => {
  it("validates nullable publication data", async () => {
    await expect(getPublicationsResult(async () => [publication])).resolves.toEqual({
      status: "success",
      data: [publication],
    });
  });

  it("maps empty, network and invalid responses", async () => {
    await expect(getPublicationsResult(async () => [])).resolves.toEqual({ status: "empty" });
    await expect(
      getPublicationsResult(async () => {
        throw new Error("network detail");
      }),
    ).resolves.toEqual({ status: "unavailable" });
    await expect(
      getPublicationsResult(async () => [{ ...publication, id: "invalid" }]),
    ).resolves.toEqual({ status: "unavailable" });
  });
});
