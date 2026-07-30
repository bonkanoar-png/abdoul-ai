import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectGrid } from "@/features/projects";
import { projectFixture } from "@/features/projects/project.fixture";

const webProject = {
  ...projectFixture,
  id: "123e4567-e89b-42d3-a456-426614174010",
  slug: "my-resto",
  title: "MyResto",
  category: "Web",
  technologies: [
    {
      ...projectFixture.technologies[0],
      id: "123e4567-e89b-42d3-a456-426614174011",
      name: "React",
      category: "Frontend",
    },
  ],
};

describe("ProjectFilters", () => {
  it("filters locally by category", () => {
    render(<ProjectGrid projects={[projectFixture, webProject]} />);

    fireEvent.change(screen.getByLabelText("Catégorie"), { target: { value: "Web" } });

    expect(screen.getByRole("heading", { name: "MyResto" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: projectFixture.title })).not.toBeInTheDocument();
  });

  it("filters locally by technology", () => {
    render(<ProjectGrid projects={[projectFixture, webProject]} />);

    fireEvent.change(screen.getByLabelText("Technologie"), { target: { value: "BERT" } });

    expect(screen.getByRole("heading", { name: projectFixture.title })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "MyResto" })).not.toBeInTheDocument();
  });
});
