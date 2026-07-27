import { SectionHeading } from "@/components/common/section-heading";
import { Container } from "@/components/ui/container";
import type { Experience } from "@/types/portfolio";

type ExperienceListProps = {
  experiences: Experience[];
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function ExperienceList({ experiences }: ExperienceListProps) {
  if (experiences.length === 0) {
    return null;
  }

  return (
    <section className="border-line bg-surface border-y py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Parcours"
          title="Des expériences guidées par l’utilité."
          description="Une trajectoire construite autour de produits clairs, robustes et accessibles."
        />

        <ol className="divide-line border-line mt-14 divide-y border-y">
          {experiences.map((experience) => (
            <li
              className="grid gap-5 py-8 md:grid-cols-[0.7fr_1fr_1.5fr] md:gap-8"
              key={experience.id}
            >
              <p className="text-accent-strong text-sm font-semibold">
                {formatDate(experience.start_date)} —{" "}
                {experience.is_current
                  ? "Aujourd’hui"
                  : experience.end_date
                    ? formatDate(experience.end_date)
                    : ""}
              </p>
              <div>
                <h3 className="text-ink text-xl font-bold tracking-[-0.03em]">{experience.role}</h3>
                <p className="text-muted mt-1 text-sm font-semibold">{experience.company}</p>
              </div>
              <p className="text-muted leading-7">{experience.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
