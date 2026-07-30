import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DataLabPage, { metadata } from "@/app/data-lab/page";

describe("DataLabPage", () => {
  it("renders dataset, metrics, table and model comparison", () => {
    render(<DataLabPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Data Lab" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Customer NLP Dataset" })).toBeInTheDocument();
    expect(screen.getAllByText("94%")).toHaveLength(2);
    expect(
      screen.getByRole("table", { name: "Extrait simulé du Customer NLP Dataset" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("table", {
        name: "Comparaison Accuracy, Precision et Recall des modèles simulés",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Random Forest")).toBeInTheDocument();
    expect(screen.getByText("XGBoost")).toBeInTheDocument();
  });

  it("provides an accessible textual chart alternative", () => {
    render(<DataLabPage />);

    expect(screen.getByRole("img", { name: /Incident représente 72%/ })).toBeInTheDocument();
  });

  it("defines Data Lab metadata", () => {
    expect(metadata).toMatchObject({ title: { absolute: "Data Lab — Abdoul AI" } });
  });
});
