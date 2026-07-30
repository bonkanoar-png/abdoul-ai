import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ContactCard, ContactForm } from "@/features/contact";
import { getProfileResult } from "@/features/profile/services/get-profile";

export const metadata: Metadata = {
  title: { absolute: "Contact — Abdoul AI" },
  description: "Contacter Abdoul pour des projets en IA, data science et développement logiciel.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const profile = await getProfileResult();

  return (
    <main>
      <Section className="pt-24 sm:pt-28" aria-labelledby="contact-title">
        <Container>
          <div className="max-w-3xl">
            <p className="text-accent-strong text-xs font-bold tracking-[0.2em] uppercase">
              Échangeons
            </p>
            <h1
              className="text-ink mt-4 text-5xl leading-tight font-bold tracking-[-0.05em] text-balance sm:text-6xl"
              id="contact-title"
            >
              Contact
            </h1>
            <p className="text-muted mt-6 text-xl leading-9 text-pretty">
              Un projet Data, IA ou logiciel à construire ? Partagez votre contexte pour préparer un
              premier échange utile.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-[0.65fr_1fr]">
            <ContactCard profile={profile.status === "success" ? profile.data : null} />
            <ContactForm />
          </div>
        </Container>
      </Section>
    </main>
  );
}
