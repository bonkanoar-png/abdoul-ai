import type { Metadata } from "next";

import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "Publications" };

export default function PublicationsPage() {
  return (
    <RoutePlaceholder
      eyebrow="Publications"
      title="Partager les apprentissages et les décisions."
      description="Les publications seront proposées ici sans connexion aux données à ce stade."
    />
  );
}
