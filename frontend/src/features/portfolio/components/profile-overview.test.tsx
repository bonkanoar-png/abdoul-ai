import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProfileOverview } from "@/features/portfolio/components/profile-overview";
import type { Profile } from "@/types/portfolio";

const profile: Profile = {
  id: "profile-id",
  name: "Abdoul",
  title: "AI Engineer",
  bio: "Je conçois des expériences accessibles.",
  location: "France",
  email: "contact@example.com",
  github_url: null,
  linkedin_url: null,
  avatar_url: null,
  created_at: "2026-07-27T10:30:00Z",
  updated_at: "2026-07-27T10:30:00Z",
};

describe("ProfileOverview", () => {
  it("renders the public profile data", () => {
    render(<ProfileOverview profile={profile} />);

    expect(screen.getByRole("heading", { name: "AI Engineer" })).toBeInTheDocument();
    expect(screen.getByText("Abdoul")).toBeInTheDocument();
    expect(screen.getByText("France")).toBeInTheDocument();
    expect(screen.getByText(profile.bio)).toBeInTheDocument();
  });
});
