import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Loader } from "@/components/ui/loader";
import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";

describe("design system primitives", () => {
  it("supports native actions and navigation links", () => {
    const onClick = vi.fn();
    render(
      <>
        <Button onClick={onClick}>Continuer</Button>
        <Button href="#profil" variant="secondary">
          Voir le profil
        </Button>
      </>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Continuer" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: "Voir le profil" })).toHaveAttribute("href", "#profil");
  });

  it("exposes semantic feedback and structure", () => {
    render(
      <>
        <Section aria-label="Expertise">
          <Card>
            <Badge variant="success">Disponible</Badge>
            <Avatar name="Abdoul AI" />
          </Card>
        </Section>
        <Separator />
        <Loader label="Chargement du contenu" />
        <EmptyState title="Aucun résultat" description="Aucune donnée disponible." />
        <ErrorState title="Erreur" description="Une erreur est survenue." />
      </>,
    );

    expect(screen.getByRole("region", { name: "Expertise" })).toBeInTheDocument();
    expect(screen.getByLabelText("Abdoul AI")).toHaveTextContent("AA");
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "horizontal");
    expect(screen.getByRole("status")).toHaveTextContent("Chargement du contenu");
    expect(screen.getByRole("alert")).toHaveTextContent("Une erreur est survenue.");
  });
});
