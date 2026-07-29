import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AboutPage, { metadata } from "@/app/about/page";
import { getProfileResult } from "@/features/profile/services/get-profile";
import type { Profile } from "@/types/profile";

vi.mock("@/features/profile/services/get-profile", () => ({
  getProfileResult: vi.fn(),
}));

const profile = {
  id: "123e4567-e89b-42d3-a456-426614174000",
  name: "Abdoul",
  title: "Data Scientist & AI Engineer",
  bio: "Je conçois des produits Data et IA robustes.",
  location: "Paris, France",
  email: "abdoul@example.com",
  github_url: "https://github.com/abdoul",
  linkedin_url: null,
  avatar_url: null,
  created_at: "2026-07-01T10:00:00Z",
  updated_at: "2026-07-02T10:00:00Z",
} satisfies Profile;

describe("AboutPage", () => {
  beforeEach(() => vi.mocked(getProfileResult).mockReset());

  it("renders profile data returned by the server service", async () => {
    vi.mocked(getProfileResult).mockResolvedValue({ status: "success", data: profile });

    render(await AboutPage());

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Abdoul" })).toBeInTheDocument();
    expect(screen.getByText(profile.bio)).toBeInTheDocument();
  });

  it("renders the empty state for a missing profile", async () => {
    vi.mocked(getProfileResult).mockResolvedValue({ status: "not-found" });

    render(await AboutPage());

    expect(screen.getByRole("heading", { name: "Profil bientôt disponible" })).toBeInTheDocument();
  });

  it("renders a safe alert without internal API details", async () => {
    vi.mocked(getProfileResult).mockResolvedValue({ status: "unavailable" });

    render(await AboutPage());

    expect(screen.getByRole("alert")).toHaveTextContent("Profil momentanément indisponible");
    expect(screen.queryByText(/INTERNAL_ERROR|Private detail/)).not.toBeInTheDocument();
  });

  it("defines specific About metadata", () => {
    expect(metadata).toMatchObject({
      title: { absolute: "À propos d'Abdoul — Data, IA et Backend Engineering" },
    });
  });
});
