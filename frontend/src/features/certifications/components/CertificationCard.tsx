import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Certification } from "@/features/certifications/schemas/certification.schema";

type CertificationCardProps = {
  certification: Certification;
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function CertificationCard({ certification }: CertificationCardProps) {
  const issuedAt = certification.date ?? certification.issued_at;

  return (
    <article aria-labelledby={`certification-${certification.id}`}>
      <Card>
        <time className="text-accent-strong text-sm font-semibold" dateTime={issuedAt}>
          {formatDate(issuedAt)}
        </time>
        <h2
          className="text-ink mt-4 text-2xl font-bold tracking-[-0.03em]"
          id={`certification-${certification.id}`}
        >
          {certification.name}
        </h2>
        <p className="text-muted mt-2 font-semibold">{certification.issuer}</p>
        {certification.description ? (
          <p className="text-muted mt-5 leading-7">{certification.description}</p>
        ) : null}
        {certification.credential_url ? (
          <div className="mt-7">
            <Button
              href={certification.credential_url}
              rel="noreferrer"
              target="_blank"
              variant="secondary"
            >
              Vérifier la certification (nouvel onglet)
            </Button>
          </div>
        ) : null}
      </Card>
    </article>
  );
}
