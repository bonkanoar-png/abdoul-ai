import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import {
  CareerScore,
  CVUploader,
  JobMatchCard,
  ProfileAnalyzer,
  RecommendationPanel,
  SkillMatchCard,
} from "@/features/career-copilot";
import { getMockCareerAnalysis } from "@/features/career-copilot/services/career-service";

export const metadata: Metadata = {
  title: { absolute: "Career Copilot — Abdoul AI" },
  description:
    "Assistant carrière pour analyser les compétences et explorer les opportunités professionnelles.",
};

export default function CareerCopilotPage() {
  const analysis = getMockCareerAnalysis();

  return (
    <main>
      <Section className="pt-24 sm:pt-28" aria-labelledby="career-title">
        <Container>
          <div className="max-w-4xl">
            <p className="text-accent-strong text-xs font-bold tracking-[0.2em] uppercase">
              Expérience carrière
            </p>
            <h1
              className="text-ink mt-4 text-5xl leading-tight font-bold tracking-[-0.05em] text-balance sm:text-6xl"
              id="career-title"
            >
              Career Copilot
            </h1>
            <p className="text-muted mt-6 max-w-3xl text-xl leading-9 text-pretty">
              Analysez un profil professionnel, identifiez les compétences et préparez votre
              évolution de carrière.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-[0.75fr_1fr]">
            <CVUploader />
            <CareerScore score={analysis.score} label={analysis.scoreLabel} />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.75fr]">
            <ProfileAnalyzer profile={analysis.profile} />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              {analysis.skillMatches.map((skill) => (
                <SkillMatchCard skill={skill} key={skill.name} />
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <JobMatchCard job={analysis.jobMatch} />
            <RecommendationPanel recommendations={analysis.recommendations} />
          </div>
        </Container>
      </Section>
    </main>
  );
}
