import { describe, expect, it } from "vitest";

import { formationFixtures } from "@/features/formations/fixtures/formations";
import { formationSchema } from "@/features/formations/schemas/formation.schema";

describe("formationSchema", () => {
  it("validates a complete formation", () => {
    expect(formationSchema.parse(formationFixtures[0])).toEqual(formationFixtures[0]);
  });

  it("accepts omitted optional fields", () => {
    expect(formationSchema.safeParse(formationFixtures[1]).success).toBe(true);
  });

  it("rejects invalid data", () => {
    expect(
      formationSchema.safeParse({
        ...formationFixtures[0],
        id: "invalid",
        endDate: "2019",
        skills: [],
      }).success,
    ).toBe(false);
  });
});
