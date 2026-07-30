import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CareerCopilotPage, { metadata } from "@/app/career-copilot/page";

describe("CareerCopilotPage", () => {
  it("renders score, profile matching and recommendations", () => {
    render(<CareerCopilotPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Career Copilot" })).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Score carrière 87 sur 100" })).toBeInTheDocument();
    expect(screen.getAllByText("Python")).toHaveLength(2);
    expect(screen.getByText("95% match")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Machine Learning Engineer" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Recommandations" })).toBeInTheDocument();
  });

  it("defines Career Copilot metadata", () => {
    expect(metadata).toMatchObject({
      title: { absolute: "Career Copilot — Abdoul AI" },
    });
  });
});
