import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Section } from "@/components/ui/section";
import { ProfileCard } from "@/features/profile";
import { getProfileResult } from "@/features/profile/services/get-profile";

export const metadata: Metadata = {
  title: { absolute: "À propos d'Abdoul — Data, IA et Backend Engineering" },
  description:
    "Découvrez le profil d’Abdoul, son approche de la Data, de l’Intelligence Artificielle et du Backend Engineering.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const profile = await getProfileResult();

  return (
    <main>
      <Section className="pt-24 sm:pt-28">
        <Container>
          {profile.status === "success" ? (
            <ProfileCard profile={profile.data} />
          ) : profile.status === "not-found" ? (
            <EmptyState
              title="Profil bientôt disponible"
              description="Le profil public d’Abdoul n’est pas encore disponible."
              action={
                <Button href="/" variant="secondary">
                  Retour à l’accueil
                </Button>
              }
            />
          ) : (
            <ErrorState
              title="Profil momentanément indisponible"
              description="Une erreur empêche actuellement l’affichage du profil. Réessayez dans quelques instants."
              action={
                <Button href="/about" variant="secondary">
                  Réessayer
                </Button>
              }
            />
          )}
        </Container>
      </Section>
    </main>
  );
}
