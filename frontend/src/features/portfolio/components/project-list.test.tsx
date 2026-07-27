import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectList } from "@/features/portfolio/components/project-list";
import type { Project } from "@/types/portfolio";

const project: Project = {
  id: "project-id",
  profile_id: "profile-id",
  slug: "abdoul-ai",
  title: "Abdoul AI",
  summary: "Une expérience numérique claire.",
  description: "Portfolio intelligent.",
  repository_url: "https://github.com/example/project",
  live_url: "https://example.com",
  image_url: null,
  is_featured: true,
  sort_order: 1,
  created_at: "2026-07-27T10:30:00Z",
  updated_at: "2026-07-27T10:30:00Z",
  skills: [
    {
      id: "skill-id",
      name: "Python",
      category: "Backend",
      sort_order: 1,
      created_at: "2026-07-27T10:30:00Z",
      updated_at: "2026-07-27T10:30:00Z",
    },
  ],
};

describe("ProjectList", () => {
  it("renders project data, skills and a safe external link", () => {
    render(<ProjectList projects={[project]} />);

    expect(screen.getByRole("heading", { name: "Abdoul AI" })).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Voir le projet" })).toHaveAttribute(
      "href",
      "https://example.com/",
    );
  });

  it("does not render unsafe external links", () => {
    render(
      <ProjectList
        projects={[
          {
            ...project,
            live_url: "javascript:alert(1)",
            repository_url: "file:///tmp/project",
          },
        ]}
      />,
    );

    expect(screen.queryByRole("link", { name: "Voir le projet" })).not.toBeInTheDocument();
  });

  it("renders nothing for an empty list", () => {
    const { container } = render(<ProjectList projects={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
