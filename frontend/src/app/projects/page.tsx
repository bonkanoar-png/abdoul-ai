import type { Metadata } from "next";

import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "Projets" };

export default function ProjectsPage() {
  return (
    <RoutePlaceholder
      eyebrow="Projets"
      title="Des projets pensés pour résoudre des problèmes concrets."
      description="La sélection détaillée des projets sera construite dans un prochain lot."
    />
  );
}
