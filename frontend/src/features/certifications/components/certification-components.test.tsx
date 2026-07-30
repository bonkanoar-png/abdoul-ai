import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CertificationCard, CertificationTimeline } from "@/features/certifications";
import { certificationFixture } from "@/test/fixtures";

describe("Certification components", () => {
  it("renders issuer, date, description and credential", () => {
    render(<CertificationCard certification={certificationFixture} />);

    expect(screen.getByText("Google")).toBeInTheDocument();
    expect(screen.getByText("juin 2025")).toBeInTheDocument();
    expect(screen.getByText("Certification Data.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Vérifier/ })).toHaveAttribute("target", "_blank");
  });

  it("supports nullable optional values in an accessible timeline", () => {
    render(
      <CertificationTimeline
        certifications={[
          {
            ...certificationFixture,
            credential_url: null,
            description: null,
          },
        ]}
      />,
    );

    expect(screen.getByRole("list", { name: "Certifications" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Vérifier/ })).not.toBeInTheDocument();
  });
});
