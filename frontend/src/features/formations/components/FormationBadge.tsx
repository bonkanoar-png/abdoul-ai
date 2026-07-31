import { Badge } from "@/components/ui/badge";
import type { Formation } from "@/features/formations/types/formation";

type FormationBadgeProps = Pick<Formation, "degree" | "type">;

export function FormationBadge({ degree, type }: FormationBadgeProps) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Niveau et domaine de formation">
      <Badge variant="accent">{degree}</Badge>
      <Badge>{type}</Badge>
    </div>
  );
}
