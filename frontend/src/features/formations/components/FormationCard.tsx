import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormationBadge } from "@/features/formations/components/FormationBadge";
import type { Formation } from "@/features/formations/types/formation";

type FormationCardProps = {
  formation: Formation;
};

export function FormationCard({ formation }: FormationCardProps) {
  const period = `${formation.startDate} — ${formation.endDate ?? "En cours"}`;

  return (
    <article aria-labelledby={`formation-${formation.id}`}>
      <Card className="h-full">
        <FormationBadge degree={formation.degree} type={formation.type} />
        <p className="text-accent-strong mt-5 text-sm font-semibold">
          <time dateTime={formation.startDate}>{formation.startDate}</time>
          {" — "}
          {formation.endDate ? (
            <time dateTime={formation.endDate}>{formation.endDate}</time>
          ) : (
            "En cours"
          )}
        </p>
        <h2
          className="text-ink mt-3 text-2xl font-bold tracking-[-0.03em]"
          id={`formation-${formation.id}`}
        >
          {formation.title}
        </h2>
        <p className="text-muted mt-2 font-semibold">
          {formation.institution} · {formation.location}
        </p>
        <p className="sr-only">Période : {period}</p>
        <p className="text-muted mt-5 leading-7">{formation.description}</p>
        {formation.mention ? (
          <p className="text-ink mt-4 text-sm font-semibold">Mention : {formation.mention}</p>
        ) : null}
        {formation.credential ? (
          <p className="text-muted mt-2 text-sm">Diplôme : {formation.credential}</p>
        ) : null}
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Compétences acquises">
          {formation.skills.map((skill) => (
            <li key={skill}>
              <Badge variant="accent">{skill}</Badge>
            </li>
          ))}
        </ul>
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
