import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContactCard } from "@/features/contact";
import { profileFixture } from "@/test/fixtures";

describe("ContactCard", () => {
  it("renders profile coordinates and accessible external links", () => {
    render(<ContactCard profile={profileFixture} />);

    expect(screen.getByText(profileFixture.email)).toBeInTheDocument();
    expect(screen.getByText(profileFixture.location)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute("target", "_blank");
  });

  it("renders a safe fallback without profile data", () => {
    render(<ContactCard profile={null} />);

    expect(screen.getByText(/coordonnées sont momentanément indisponibles/)).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Liens du profil" })).not.toBeInTheDocument();
  });
});
