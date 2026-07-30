import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ChartPanel,
  DatasetCard,
  DataTable,
  InsightCard,
  MetricCard,
  ModelComparison,
} from "@/features/data-lab";
import { getMockDataLab } from "@/features/data-lab/services/data-lab-service";

describe("Data Lab presentation", () => {
  const lab = getMockDataLab();

  it("renders dataset, metric and insight cards", () => {
    render(
      <>
        <DatasetCard dataset={lab.dataset} />
        <MetricCard metric={lab.metrics[0]} />
        <InsightCard insight={lab.insight} />
      </>,
    );

    expect(screen.getByRole("heading", { name: lab.dataset.name })).toBeInTheDocument();
    expect(
      screen.getByText(
        (_content, element) =>
          element?.tagName === "SPAN" && element.textContent?.includes("10 000 lignes") === true,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("94%")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Insight principal" })).toBeInTheDocument();
  });

  it("renders accessible table headers and chart alternatives", () => {
    render(
      <>
        <DataTable table={lab.table} />
        <ChartPanel chart={lab.chart} />
      </>,
    );

    expect(screen.getByRole("columnheader", { name: "Catégorie" })).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(4);
    expect(screen.getByRole("img", { name: lab.chart.description })).toBeInTheDocument();
  });

  it("renders model metrics and supports an empty comparison", () => {
    const { rerender } = render(<ModelComparison models={lab.models} />);
    expect(screen.getByRole("rowheader", { name: "XGBoost" })).toBeInTheDocument();
    expect(screen.getAllByText("94%")).toHaveLength(1);

    rerender(<ModelComparison models={[]} />);
    expect(screen.getAllByRole("row")).toHaveLength(1);
  });
});
