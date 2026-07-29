import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProfileCard } from "@/features/profile";
import type { Profile } from "@/types/profile";

const profile = {
  id: "123e4567-e89b-42d3-a456-426614174000",
  name: "Abdoul",
  title: "Data Scientist & AI Engineer",
  bio: "Je conçois des produits Data et IA robustes.",
  location: "Paris, France",
  email: "abdoul@example.com",
  github_url: "https://github.com/abdoul",
  linkedin_url: "https://linkedin.com/in/abdoul",
  avatar_url: null,
  created_at: "2026-07-01T10:00:00Z",
  updated_at: "2026-07-02T10:00:00Z",
} satisfies Profile;

describe("ProfileCard", () => {
  it("renders the complete public profile and accessible social links", () => {
    render(<ProfileCard profile={profile} />);

    expect(screen.getByRole("article")).toHaveAccessibleName("À propos");
    expect(screen.getByText(profile.bio)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:abdoul@example.com",
    );
    expect(screen.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
      "href",
      "https://linkedin.com/in/abdoul",
    );
    expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/abdoul",
    );
  });

  it("omits nullable social links", () => {
    render(<ProfileCard profile={{ ...profile, github_url: null, linkedin_url: null }} />);

    expect(screen.queryByRole("link", { name: /GitHub/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /LinkedIn/ })).not.toBeInTheDocument();
  });
});
