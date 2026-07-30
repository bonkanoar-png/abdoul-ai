import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ContactPage, { metadata } from "@/app/contact/page";
import { getProfileResult } from "@/features/profile/services/get-profile";
import type { Profile } from "@/types/profile";

vi.mock("@/features/profile/services/get-profile", () => ({
  getProfileResult: vi.fn(),
}));

const profile = {
  id: "123e4567-e89b-42d3-a456-426614174000",
  name: "Abdoul",
  title: "AI Engineer",
  bio: "Bio",
  location: "France",
  email: "abdoul@example.com",
  github_url: "https://github.com/abdoul",
  linkedin_url: null,
  avatar_url: null,
  created_at: "2026-07-01T10:00:00Z",
  updated_at: "2026-07-02T10:00:00Z",
} satisfies Profile;

describe("ContactPage", () => {
  beforeEach(() => vi.mocked(getProfileResult).mockReset());

  it("renders profile contact details and the form", async () => {
    vi.mocked(getProfileResult).mockResolvedValue({ status: "success", data: profile });

    render(await ContactPage());

    expect(screen.getByRole("heading", { level: 1, name: "Contact" })).toBeInTheDocument();
    expect(screen.getByText(profile.email)).toBeInTheDocument();
    expect(screen.getByText(profile.location)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Valider le message" })).toBeInTheDocument();
  });

  it("keeps the form available when profile data is unavailable", async () => {
    vi.mocked(getProfileResult).mockResolvedValue({ status: "unavailable" });

    render(await ContactPage());

    expect(screen.getByText(/coordonnées sont momentanément indisponibles/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/)).toBeInTheDocument();
  });

  it("defines Contact metadata", () => {
    expect(metadata).toMatchObject({ title: { absolute: "Contact — Abdoul AI" } });
  });
});
