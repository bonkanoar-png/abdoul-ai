import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import FormationsPage, { metadata } from "@/app/formations/page";
import {
  FormationBadge,
  FormationCard,
  FormationTimeline,
  type Formation,
} from "@/features/formations";
import { formationFixtures } from "@/features/formations/fixtures/formations";
import { getFormationsResult } from "@/features/formations/services/formation-service";

vi.mock("@/features/formations/services/formation-service", () => ({
  getFormationsResult: vi.fn(),
}));

const formation = formationFixtures[0] satisfies Formation;

describe("FormationsPage", () => {
  beforeEach(() => vi.mocked(getFormationsResult).mockReset());

  it("renders the four real formations and their skills", async () => {
    vi.mocked(getFormationsResult).mockResolvedValue({
      status: "success",
      data: formationFixtures,
    });

    render(await FormationsPage());

    expect(screen.getByRole("heading", { level: 1, name: "Formations" })).toBeInTheDocument();
    for (const item of formationFixtures) {
      expect(screen.getByRole("heading", { name: item.degree })).toBeInTheDocument();
    }
    expect(screen.getByText("Université Paris-Est Créteil (UPEC) · France")).toBeInTheDocument();
    expect(screen.getAllByText("Talend")).toHaveLength(2);
    expect(screen.getAllByText("R")).toHaveLength(4);
  });

  it("renders the empty state", async () => {
    vi.mocked(getFormationsResult).mockResolvedValue({ status: "empty" });

    render(await FormationsPage());

    expect(
      screen.getByRole("heading", { name: "Formations bientôt disponibles" }),
    ).toBeInTheDocument();
  });

  it("renders a safe error state", async () => {
    vi.mocked(getFormationsResult).mockResolvedValue({ status: "error" });

    render(await FormationsPage());

    expect(screen.getByRole("alert")).toHaveTextContent("Formations momentanément indisponibles");
  });

  it("defines route metadata", () => {
    expect(metadata).toMatchObject({ title: { absolute: "Formations — Abdoul AI" } });
  });
});

describe("Formation components", () => {
  it("renders a card with its required and optional fields", () => {
    render(<FormationCard formation={formation} />);

    expect(screen.getByRole("heading", { name: formation.degree })).toBeInTheDocument();
    expect(screen.getByText(formation.field)).toBeInTheDocument();
    expect(screen.getByText("Obtenu")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Points clés" })).toBeInTheDocument();
    expect(screen.getAllByText(formation.skills[0])).toHaveLength(2);
    expect(screen.getByRole("link", { name: /Découvrir l’établissement/ })).toHaveAttribute(
      "target",
      "_blank",
    );
  });

  it("renders optional technologies and safely omits the website", () => {
    render(<FormationCard formation={formationFixtures[1]} />);

    expect(
      screen.getByText(
        (_content, element) =>
          element?.tagName === "P" &&
          element.textContent?.includes("Technologies : Talend") === true,
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Découvrir l’établissement/ }),
    ).not.toBeInTheDocument();
  });

  it("renders the degree and domain badge", () => {
    render(
      <FormationBadge
        degree="Master 2 Sciences des données"
        field="Data Science"
        status="Obtenu"
      />,
    );

    expect(screen.getByText("Master")).toBeInTheDocument();
    expect(screen.getByText("Data Science")).toBeInTheDocument();
    expect(screen.getByText("Obtenu")).toBeInTheDocument();
  });

  it("renders an accessible timeline and its empty state", () => {
    const { rerender } = render(<FormationTimeline formations={[formation]} />);

    expect(screen.getByRole("list", { name: "Parcours de formation" })).toBeInTheDocument();

    rerender(<FormationTimeline formations={[]} />);
    expect(screen.getByText("Aucune formation disponible.")).toBeInTheDocument();
  });
});
