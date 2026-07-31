import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExperienceBadge } from "@/features/experience/components/ExperienceBadge";
import type { Experience } from "@/features/experience/schemas/experience.schema";

type ExperienceCardProps = {
  experience: Experience;
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const endLabel =
    experience.is_current || !experience.end_date ? "Aujourd’hui" : formatDate(experience.end_date);

  return (
    <article aria-labelledby={`experience-${experience.id}`}>
      <Card className="h-full">
        {experience.contract_type ? (
          <ExperienceBadge
            contractType={experience.contract_type}
            current={experience.is_current}
          />
        ) : null}
        <p className="text-accent-strong mt-5 text-sm font-semibold">
          <time dateTime={experience.start_date}>{formatDate(experience.start_date)}</time>
          {" — "}
          {experience.is_current || !experience.end_date ? (
            endLabel
          ) : (
            <time dateTime={experience.end_date}>{endLabel}</time>
          )}
        </p>
        <h2
          className="text-ink mt-4 text-2xl font-bold tracking-[-0.03em]"
          id={`experience-${experience.id}`}
        >
          {experience.role}
        </h2>
        <p className="text-muted mt-1 font-semibold">
          {experience.company}
          {experience.location ? ` · ${experience.location}` : ""}
        </p>
        <p className="text-muted mt-5 leading-7">{experience.description}</p>

        {experience.results?.length ? (
          <section className="mt-7" aria-labelledby={`experience-results-${experience.id}`}>
            <h3 className="text-ink text-base font-bold" id={`experience-results-${experience.id}`}>
              Impact professionnel
            </h3>
            <ul className="text-muted mt-3 space-y-2 leading-7">
              {experience.results.map((result) => (
                <li className="flex gap-3" key={result}>
                  <span className="text-accent" aria-hidden="true">
                    •
                  </span>
                  <span>{result}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {experience.missions?.length ? (
          <section className="mt-7" aria-labelledby={`experience-missions-${experience.id}`}>
            <h3
              className="text-ink text-base font-bold"
              id={`experience-missions-${experience.id}`}
            >
              Missions
            </h3>
            <ul className="text-muted mt-3 grid gap-2 leading-7 sm:grid-cols-2">
              {experience.missions.map((mission) => (
                <li className="flex gap-3" key={mission}>
                  <span className="text-accent" aria-hidden="true">
                    •
                  </span>
                  <span>{mission}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {experience.environment?.length ? (
          <p className="text-muted mt-7 text-sm leading-6">
            <span className="text-ink font-bold">Environnement :</span>{" "}
            {experience.environment.join(" · ")}
          </p>
        ) : null}

        {experience.publication ? (
          <blockquote className="border-accent text-muted mt-7 border-l-2 pl-4 text-sm leading-6">
            <span className="text-ink font-bold">Publication :</span> “{experience.publication}”
          </blockquote>
        ) : null}

        {experience.technologies?.length ? (
          <section className="mt-7" aria-labelledby={`experience-technologies-${experience.id}`}>
            <h3
              className="text-ink text-base font-bold"
              id={`experience-technologies-${experience.id}`}
            >
              Technologies
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Technologies">
              {experience.technologies.map((technology) => (
                <li key={technology}>
                  <Badge variant="accent">{technology}</Badge>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {experience.skills?.length ? (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Compétences professionnelles">
            {experience.skills.map((skill) => (
              <li key={skill}>
                <Badge>{skill}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </Card>
    </article>
  );
}
