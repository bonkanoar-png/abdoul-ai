import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Publication } from "@/features/publications/schemas/publication.schema";

type PublicationCardProps = {
  publication: Publication;
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function PublicationCard({ publication }: PublicationCardProps) {
  return (
    <article aria-labelledby={`publication-${publication.id}`}>
      <Card className="flex h-full flex-col">
        <time
          className="text-accent-strong text-sm font-semibold"
          dateTime={publication.published_at}
        >
          {formatDate(publication.published_at)}
        </time>
        <h2
          className="text-ink mt-4 text-2xl font-bold tracking-[-0.03em]"
          id={`publication-${publication.id}`}
        >
          {publication.title}
        </h2>
        <p className="text-muted mt-4 leading-7">{publication.summary}</p>
        {publication.tags?.length ? (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Thèmes">
            {publication.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="accent">{tag}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
        {publication.url ? (
          <div className="mt-auto pt-7">
            <Button href={publication.url} rel="noreferrer" target="_blank" variant="secondary">
              Lire la publication (nouvel onglet)
            </Button>
          </div>
        ) : null}
      </Card>
    </article>
  );
}
