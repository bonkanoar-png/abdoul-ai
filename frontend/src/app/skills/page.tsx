import type { Metadata } from "next";

import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "Compétences" };

export default function SkillsPage() {
  return (
    <RoutePlaceholder
      eyebrow="Compétences"
      title="Des expertises techniques structurées et lisibles."
      description="Le catalogue des compétences sera intégré ultérieurement."
    />
  );
}
