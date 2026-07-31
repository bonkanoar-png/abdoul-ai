import { describe, expect, it } from "vitest";

import {
  getFormations,
  getFormationsResult,
} from "@/features/formations/services/formation-service";

describe("formation service", () => {
  it("returns validated fixtures", async () => {
    await expect(getFormations()).resolves.toHaveLength(4);
  });

  it("returns success, empty and error states", async () => {
    await expect(getFormationsResult()).resolves.toMatchObject({ status: "success" });
    await expect(getFormationsResult(async () => [])).resolves.toEqual({ status: "empty" });
    await expect(
      getFormationsResult(async () => {
        throw new Error("unavailable");
      }),
    ).resolves.toEqual({ status: "error" });
  });
});
