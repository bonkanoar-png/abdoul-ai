import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectDetails, ProjectGrid } from "@/features/projects";
import { projectFixture } from "@/features/projects/project.fixture";

describe("Project presentation components", () => {
  it("renders details, results, technologies and optional links", () => {
    render(<ProjectDetails project={projectFixture} />);

    expect(
      screen.getByRole("heading", { level: 1, name: projectFixture.title }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Résultats et démarche" })).toBeInTheDocument();
    expect(screen.getByText("BERT")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Voir le code/ })).toHaveAttribute("target", "_blank");
  });

  it("omits nullable links and falls back to the project description", () => {
    render(
      <ProjectDetails
        project={{
          ...projectFixture,
          content: null,
          github_url: null,
          demo_url: null,
        }}
      />,
    );

    expect(screen.getAllByText(projectFixture.description)).toHaveLength(2);
    expect(screen.queryByRole("navigation", { name: "Liens externes du projet" })).toBeNull();
  });

  it("renders the filtered-grid empty state for no projects", () => {
    render(<ProjectGrid projects={[]} />);

    expect(screen.getByRole("heading", { name: "Aucun projet trouvé" })).toBeInTheDocument();
  });
});
