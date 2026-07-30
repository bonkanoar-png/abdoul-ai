import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectCard } from "@/features/projects";
import { projectFixture } from "@/features/projects/project.fixture";

describe("ProjectCard", () => {
  it("renders its title, technologies and accessible image fallback", () => {
    render(<ProjectCard project={projectFixture} />);

    expect(screen.getByRole("heading", { name: projectFixture.title })).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("BERT")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: `Aucun aperçu disponible pour ${projectFixture.title}` }),
    ).toBeInTheDocument();
  });

  it("links to the local detail page and tolerates optional external links", () => {
    render(<ProjectCard project={{ ...projectFixture, github_url: null, demo_url: null }} />);

    expect(screen.getByRole("link", { name: "Découvrir le projet" })).toHaveAttribute(
      "href",
      `/projects/${projectFixture.slug}`,
    );
  });
});
