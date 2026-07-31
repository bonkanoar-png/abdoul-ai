import { Badge } from "@/components/ui/badge";
import type { Formation } from "@/features/formations/types/formation";

type FormationBadgeProps = Pick<Formation, "degree" | "field" | "status">;

export function FormationBadge({ degree, field, status }: FormationBadgeProps) {
  const level = degree.startsWith("Licence") ? "Licence" : "Master";

  return (
    <div className="flex flex-wrap gap-2" aria-label="Niveau, domaine et statut de formation">
      <Badge variant="accent">{level}</Badge>
      <Badge>{field}</Badge>
      <Badge variant="success">{status}</Badge>
    </div>
  );
}
