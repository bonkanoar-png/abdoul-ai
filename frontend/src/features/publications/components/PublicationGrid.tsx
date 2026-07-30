import { PublicationCard } from "@/features/publications/components/PublicationCard";
import type { Publication } from "@/features/publications/schemas/publication.schema";

type PublicationGridProps = {
  publications: Publication[];
};

export function PublicationGrid({ publications }: PublicationGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {publications.map((publication) => (
        <PublicationCard publication={publication} key={publication.id} />
      ))}
    </div>
  );
}
