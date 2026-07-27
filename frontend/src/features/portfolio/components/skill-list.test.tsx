import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SkillList } from "@/features/portfolio/components/skill-list";
import type { Skill } from "@/types/portfolio";

const timestamps = {
  created_at: "2026-07-27T10:30:00Z",
  updated_at: "2026-07-27T10:30:00Z",
};

const skills: Skill[] = [
  {
    id: "python",
    name: "Python",
    category: "Backend",
    sort_order: 1,
    ...timestamps,
  },
  {
    id: "fastapi",
    name: "FastAPI",
    category: "Backend",
    sort_order: 2,
    ...timestamps,
  },
  {
    id: "next",
    name: "Next.js",
    category: "Frontend",
    sort_order: 3,
    ...timestamps,
  },
];

describe("SkillList", () => {
  it("groups and renders skills by category", () => {
    render(<SkillList skills={skills} />);

    expect(screen.getByRole("heading", { name: "Backend" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Frontend" })).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("FastAPI")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("renders nothing for an empty list", () => {
    const { container } = render(<SkillList skills={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
