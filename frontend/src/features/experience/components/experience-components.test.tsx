import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ExperienceBadge, ExperienceCard, ExperienceTimeline } from "@/features/experience";
import { experienceFixtures } from "@/features/experience/fixtures/experiences";
import { experienceFixture } from "@/test/fixtures";

describe("Experience components", () => {
  it("renders optional location, technologies and current dates", () => {
    render(<ExperienceCard experience={experienceFixture} />);

    expect(screen.getByRole("heading", { name: experienceFixture.role })).toBeInTheDocument();
    expect(screen.getByText(/Orange SA · Paris/)).toBeInTheDocument();
    expect(
      screen.getByText(
        (_content, element) =>
          element?.tagName === "P" && element.textContent?.includes("Aujourd’hui") === true,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
  });

  it("omits optional metadata safely", () => {
    render(
      <ExperienceCard experience={{ ...experienceFixture, location: null, technologies: null }} />,
    );

    expect(screen.getByText("Orange SA")).toBeInTheDocument();
    expect(screen.queryByLabelText("Technologies")).not.toBeInTheDocument();
  });

  it("uses an accessible ordered timeline and supports an empty list", () => {
    const { rerender } = render(<ExperienceTimeline experiences={[experienceFixture]} />);
    expect(screen.getByRole("list", { name: "Parcours professionnel" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);

    rerender(<ExperienceTimeline experiences={[]} />);
    expect(screen.getByRole("list", { name: "Parcours professionnel" })).toBeEmptyDOMElement();
  });

  it("renders contract, impact, missions, skills, environment and publication", () => {
    render(<ExperienceCard experience={experienceFixtures[3]} />);

    expect(screen.getByText("CDD temps partiel")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Impact professionnel" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Missions" })).toBeInTheDocument();
    expect(screen.getByText("Computer Vision")).toBeInTheDocument();
    expect(screen.getByText(/Imagerie X-Ray/)).toBeInTheDocument();
    expect(screen.getByText(/Hybrid Machine and Deep Transfer Learning/)).toBeInTheDocument();
  });

  it("identifies the current experience", () => {
    render(<ExperienceBadge contractType="CDD" current />);

    expect(screen.getByText("CDD")).toBeInTheDocument();
    expect(screen.getByText("Poste actuel")).toBeInTheDocument();
  });
});
