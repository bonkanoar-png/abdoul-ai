import { describe, expect, it } from "vitest";

import { getMockDataLab } from "@/features/data-lab/services/data-lab-service";

describe("getMockDataLab", () => {
  it("returns mock data validated by the Data Lab schema", () => {
    const lab = getMockDataLab();

    expect(lab.dataset.rows).toBe(10_000);
    expect(lab.metrics).toHaveLength(3);
    expect(lab.table.headers).toEqual(["ID", "Texte", "Catégorie", "Confiance"]);
    expect(lab.models.map((model) => model.name)).toEqual(["Random Forest", "XGBoost"]);
  });
});
