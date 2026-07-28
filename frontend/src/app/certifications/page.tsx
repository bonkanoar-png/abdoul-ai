import type { Metadata } from "next";

import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "Certifications" };

export default function CertificationsPage() {
  return (
    <RoutePlaceholder
      eyebrow="Certifications"
      title="Des compétences validées dans la durée."
      description="Les certifications professionnelles seront ajoutées dans un prochain lot."
    />
  );
}
