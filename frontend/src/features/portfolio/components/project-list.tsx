import { SectionHeading } from "@/components/common/section-heading";
import { Container } from "@/components/ui/container";
import type { Project } from "@/types/portfolio";

type ProjectListProps = {
  projects: Project[];
};

function safeExternalUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Projets"
          title="Des idées transformées en expériences concrètes."
          description="Une sélection de projets où conception, ingénierie et intelligence artificielle avancent ensemble."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => {
            const projectUrl =
              safeExternalUrl(project.live_url) ?? safeExternalUrl(project.repository_url);

            return (
              <article
                className={`flex min-h-80 flex-col justify-between rounded-[2rem] p-7 sm:p-9 ${
                  index % 3 === 0
                    ? "bg-ink text-canvas"
                    : "border border-line bg-surface text-ink"
                }`}
                key={project.id}
              >
                <div>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill) => (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          index % 3 === 0 ? "bg-canvas/10 text-canvas/75" : "bg-canvas text-muted"
                        }`}
                        key={skill.id}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-8 text-3xl font-bold tracking-[-0.045em]">{project.title}</h3>
                  <p
                    className={`mt-4 leading-7 ${
                      index % 3 === 0 ? "text-canvas/65" : "text-muted"
                    }`}
                  >
                    {project.summary}
                  </p>
                </div>

                {projectUrl ? (
                  <a
                    className="mt-10 w-fit text-sm font-bold underline decoration-accent-light decoration-2 underline-offset-4 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
                    href={projectUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Voir le projet
                  </a>
                ) : null}
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
