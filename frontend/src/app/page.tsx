import { Hero } from "@/components/common/hero";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Container } from "@/components/ui/container";
import { ExperienceList } from "@/features/portfolio/components/experience-list";
import { ProfileOverview } from "@/features/portfolio/components/profile-overview";
import { ProjectList } from "@/features/portfolio/components/project-list";
import { SkillList } from "@/features/portfolio/components/skill-list";
import { getPortfolio } from "@/features/portfolio/services/get-portfolio";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const portfolio = await getPortfolio();

  return (
    <>
      <Header />
      <main>
        <Hero />

        {portfolio.status === "success" ? (
          <>
            <ProfileOverview profile={portfolio.data.profile} />
            <ExperienceList experiences={portfolio.data.experiences} />
            <ProjectList projects={portfolio.data.projects} />
            <SkillList skills={portfolio.data.skills} />
          </>
        ) : (
          <section className="scroll-mt-10 py-24 sm:py-32" id="approche">
            <Container>
              <div className="border-line bg-surface rounded-[2rem] border p-8 sm:p-12">
                <p className="text-accent-strong text-xs font-bold tracking-[0.2em] uppercase">
                  Portfolio
                </p>
                <h2 className="text-ink mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                  {portfolio.status === "not-found"
                    ? "Le portfolio sera bientôt disponible."
                    : "Le portfolio est momentanément indisponible."}
                </h2>
                <p className="text-muted mt-4 max-w-xl leading-7">
                  Revenez dans quelques instants pour découvrir les expériences, projets et
                  expertises.
                </p>
              </div>
            </Container>
          </section>
        )}

        <section className="py-24 sm:py-32" id="decouvrir">
          <Container>
            <div className="bg-ink text-canvas relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-12 sm:py-24">
              <div
                className="bg-accent absolute top-0 left-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative mx-auto max-w-3xl">
                <p className="text-accent-light text-xs font-bold tracking-[0.2em] uppercase">
                  Abdoul AI
                </p>
                <h2 className="mt-5 text-4xl leading-tight font-bold tracking-[-0.05em] text-balance sm:text-5xl">
                  Une première couche simple. Une vision prête à grandir.
                </h2>
                <p className="text-canvas/65 mx-auto mt-6 max-w-2xl text-lg leading-8 text-pretty">
                  Une fondation visuelle cohérente, responsive et accessible pour accueillir les
                  prochaines expériences Abdoul AI.
                </p>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
