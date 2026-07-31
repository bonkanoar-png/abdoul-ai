import { Badge } from "@/components/ui/badge";

type ExperienceBadgeProps = {
  contractType: string;
  current?: boolean;
};

export function ExperienceBadge({ contractType, current = false }: ExperienceBadgeProps) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Type de contrat et statut">
      <Badge variant="accent">{contractType}</Badge>
      {current ? <Badge variant="success">Poste actuel</Badge> : null}
    </div>
  );
}
