import type { Metadata } from "next";

import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "À propos" };

export default function AboutPage() {
  return (
    <RoutePlaceholder
      eyebrow="À propos"
      title="Une approche au croisement de la data et de l’ingénierie."
      description="Cette section présentera prochainement le parcours et la démarche professionnelle."
    />
  );
}
