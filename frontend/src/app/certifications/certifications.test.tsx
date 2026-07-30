import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CertificationsPage, { metadata } from "@/app/certifications/page";
import { getCertificationsResult } from "@/features/certifications/services/get-certifications";

vi.mock("@/features/certifications/services/get-certifications", () => ({
  getCertificationsResult: vi.fn(),
}));

const certification = {
  id: "123e4567-e89b-42d3-a456-426614174001",
  name: "Google Data Analytics Certificate",
  issuer: "Google",
  issued_at: "2025-06-01",
  credential_url: null,
  description: null,
};

describe("CertificationsPage", () => {
  beforeEach(() => vi.mocked(getCertificationsResult).mockReset());

  it("renders certification cards with optional data omitted", async () => {
    vi.mocked(getCertificationsResult).mockResolvedValue({
      status: "success",
      data: [certification],
    });

    render(await CertificationsPage());

    expect(screen.getByRole("heading", { level: 1, name: "Certifications" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: certification.name })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Vérifier/ })).not.toBeInTheDocument();
  });

  it("renders empty and unavailable states", async () => {
    vi.mocked(getCertificationsResult).mockResolvedValueOnce({ status: "empty" });
    const { unmount } = render(await CertificationsPage());
    expect(
      screen.getByRole("heading", { name: "Certifications bientôt disponibles" }),
    ).toBeInTheDocument();
    unmount();

    vi.mocked(getCertificationsResult).mockResolvedValueOnce({ status: "unavailable" });
    render(await CertificationsPage());
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Certifications momentanément indisponibles",
    );
  });

  it("defines Certifications metadata", () => {
    expect(metadata).toMatchObject({ title: { absolute: "Certifications — Abdoul AI" } });
  });
});
