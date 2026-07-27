import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ExperienceList } from "@/features/portfolio/components/experience-list";
import type { Experience } from "@/types/portfolio";

const experience: Experience = {
  id: "experience-id",
  profile_id: "profile-id",
  company: "Abdoul AI",
  role: "AI Engineer",
  description: "Conception de produits utiles.",
  start_date: "2024-01-01",
  end_date: null,
  is_current: true,
  sort_order: 1,
  created_at: "2026-07-27T10:30:00Z",
  updated_at: "2026-07-27T10:30:00Z",
};

describe("ExperienceList", () => {
  it("renders experience data and the current marker", () => {
    render(<ExperienceList experiences={[experience]} />);

    expect(screen.getByRole("heading", { name: "AI Engineer" })).toBeInTheDocument();
    expect(screen.getByText("Abdoul AI")).toBeInTheDocument();
    expect(screen.getByText(/Aujourd’hui/)).toBeInTheDocument();
    expect(screen.getByText(experience.description)).toBeInTheDocument();
  });

  it("renders nothing for an empty list", () => {
    const { container } = render(<ExperienceList experiences={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
