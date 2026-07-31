import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormationBadge } from "@/features/formations/components/FormationBadge";
import type { Formation } from "@/features/formations/types/formation";

type FormationCardProps = {
  formation: Formation;
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function FormationCard({ formation }: FormationCardProps) {
  const startLabel = formatDate(formation.startDate);
  const endLabel = formation.endDate ? formatDate(formation.endDate) : "En cours";

  return (
    <article aria-labelledby={`formation-${formation.id}`}>
      <Card className="h-full">
        <FormationBadge
          degree={formation.degree}
          field={formation.field}
          status={formation.status}
        />
        <p className="text-accent-strong mt-5 text-sm font-semibold">
          <time dateTime={formation.startDate}>{startLabel}</time>
          {" — "}
          {formation.endDate ? <time dateTime={formation.endDate}>{endLabel}</time> : "En cours"}
        </p>
        <h2
          className="text-ink mt-3 text-2xl font-bold tracking-[-0.03em]"
          id={`formation-${formation.id}`}
        >
          {formation.degree}
        </h2>
        <p className="text-muted mt-2 font-semibold">
          {formation.institution} · {formation.location}
        </p>
        <p className="text-muted mt-5 leading-7">{formation.description}</p>

        <section className="mt-7" aria-labelledby={`formation-highlights-${formation.id}`}>
          <h3 className="text-ink text-base font-bold" id={`formation-highlights-${formation.id}`}>
            Points clés
          </h3>
          <ul className="text-muted mt-3 grid gap-2 leading-7 sm:grid-cols-2">
            {formation.highlights.map((highlight) => (
              <li className="flex gap-3" key={highlight}>
                <span className="text-accent" aria-hidden="true">
                  •
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </section>

        {formation.mention ? (
          <p className="text-ink mt-4 text-sm font-semibold">Mention : {formation.mention}</p>
        ) : null}

        <h3 className="text-ink mt-7 text-base font-bold">Compétences</h3>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Compétences acquises">
          {formation.skills.map((skill) => (
            <li key={skill}>
              <Badge variant="accent">{skill}</Badge>
            </li>
          ))}
        </ul>

        {formation.technologies?.length ? (
          <p className="text-muted mt-5 text-sm leading-6">
            <span className="text-ink font-bold">Technologies :</span>{" "}
            {formation.technologies.join(" · ")}
          </p>
        ) : null}

        {formation.projects?.length ? (
          <p className="text-muted mt-3 text-sm leading-6">
            <span className="text-ink font-bold">Projets :</span> {formation.projects.join(" · ")}
          </p>
        ) : null}
        {formation.website ? (
          <div className="mt-7">
            <Button href={formation.website} rel="noreferrer" target="_blank" variant="secondary">
              Découvrir l’établissement (nouvel onglet)
            </Button>
          </div>
        ) : null}
      </Card>
    </article>
  );
}
