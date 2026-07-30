import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SkillBadge, SkillCategory, SkillGrid } from "@/features/skills";
import { skillFixture } from "@/test/fixtures";

describe("Skills components", () => {
  it("renders a skill badge with optional level and without an icon", () => {
    render(<SkillBadge skill={skillFixture} />);

    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText(/Avancé/)).toBeInTheDocument();
  });

  it("renders a named category and its skills", () => {
    render(<SkillCategory category="Backend Engineering" skills={[skillFixture]} />);

    expect(screen.getByRole("heading", { name: "Backend Engineering" })).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
  });

  it("groups skills and supports an empty grid", () => {
    const { rerender, container } = render(<SkillGrid skills={[skillFixture]} />);
    expect(screen.getByRole("heading", { name: "Backend Engineering" })).toBeInTheDocument();

    rerender(<SkillGrid skills={[]} />);
    expect(container.firstElementChild).toBeEmptyDOMElement();
  });
});
