import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ExperienceCard, ExperienceTimeline } from "@/features/experience";
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
});
