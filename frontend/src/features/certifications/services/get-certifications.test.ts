import { describe, expect, it } from "vitest";

import { getCertificationsResult } from "@/features/certifications/services/get-certifications";

const certification = {
  id: "123e4567-e89b-42d3-a456-426614174001",
  name: "Certification IA",
  issuer: "Organisme",
  issued_at: "2025-06-01",
  credential_url: null,
  description: null,
};

describe("getCertificationsResult", () => {
  it("validates nullable certification data", async () => {
    await expect(getCertificationsResult(async () => [certification])).resolves.toEqual({
      status: "success",
      data: [certification],
    });
  });

  it("maps empty, unavailable and invalid data", async () => {
    await expect(getCertificationsResult(async () => [])).resolves.toEqual({ status: "empty" });
    await expect(
      getCertificationsResult(async () => {
        throw new Error("network detail");
      }),
    ).resolves.toEqual({ status: "unavailable" });
    await expect(
      getCertificationsResult(async () => [{ ...certification, issued_at: "invalid" }]),
    ).resolves.toEqual({ status: "unavailable" });
  });
});
