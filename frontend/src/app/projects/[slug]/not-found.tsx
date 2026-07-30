import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";

export default function ProjectNotFound() {
  return (
    <main>
      <Section className="pt-24 sm:pt-28">
        <Container>
          <EmptyState
            title="Projet introuvable"
            description="Le projet demandé n’existe pas ou n’est plus disponible."
            action={<Button href="/projects">Voir tous les projets</Button>}
          />
        </Container>
      </Section>
    </main>
  );
}
