import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
        <p className="text-accent-strong text-sm font-semibold">
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
        {experience.technologies?.length ? (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
            {experience.technologies.map((technology) => (
              <li key={technology}>
                <Badge variant="accent">{technology}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </Card>
    </article>
  );
}
