import type { Metadata } from "next";

import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <RoutePlaceholder
      eyebrow="Contact"
      title="Construisons une conversation utile."
      description="Les moyens de contact seront structurés sans formulaire métier dans un prochain lot."
    />
  );
}
