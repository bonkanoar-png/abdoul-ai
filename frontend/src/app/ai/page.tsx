import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ChatWindow, ConversationList } from "@/features/chat";

export const metadata: Metadata = {
  title: { absolute: "Abdoul AI Assistant" },
  description:
    "Assistant intelligent pour découvrir le parcours, les projets et les compétences d'Abdoul.",
};

export default function AiPage() {
  return (
    <main>
      <Section className="pt-24 sm:pt-28" aria-labelledby="ai-title">
        <Container>
          <div className="max-w-3xl">
            <p className="text-accent-strong text-xs font-bold tracking-[0.2em] uppercase">
              Assistant
            </p>
            <h1
              className="text-ink mt-4 text-5xl leading-tight font-bold tracking-[-0.05em] text-balance sm:text-6xl"
              id="ai-title"
            >
              Ask Abdoul AI
            </h1>
            <p className="text-muted mt-6 text-xl leading-9 text-pretty">
              Assistant intelligent pour explorer le parcours, les projets et les compétences
              d&apos;Abdoul.
            </p>
          </div>

          <div className="mt-14 grid gap-6 xl:grid-cols-[0.32fr_1fr]">
            <ConversationList />
            <ChatWindow />
          </div>

          <aside className="border-line bg-surface mt-10 rounded-[var(--radius-lg)] border p-6 sm:p-8">
            <h2 className="text-ink text-2xl font-bold tracking-[-0.03em]">
              Une interface prête pour les prochaines phases
            </h2>
            <p className="text-muted mt-4 max-w-3xl leading-7">
              Cette démonstration fonctionne exclusivement avec des réponses locales simulées. L’AI
              Engine et les sources documentaires seront connectés lors des phases 4 et 5.
            </p>
          </aside>
        </Container>
      </Section>
    </main>
  );
}
