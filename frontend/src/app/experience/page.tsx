import type { Metadata } from "next";

import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "Expérience" };

export default function ExperiencePage() {
  return (
    <RoutePlaceholder
      eyebrow="Expérience"
      title="Un parcours construit autour de produits utiles."
      description="Les expériences professionnelles seront présentées dans un prochain lot."
    />
  );
}
