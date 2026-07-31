import { FormationCard } from "@/features/formations/components/FormationCard";
import type { Formation } from "@/features/formations/types/formation";

type FormationTimelineProps = {
  formations: Formation[];
};

export function FormationTimeline({ formations }: FormationTimelineProps) {
  if (formations.length === 0) {
    return <p className="text-muted">Aucune formation disponible.</p>;
  }

  const orderedFormations = [...formations].sort((left, right) =>
    right.startDate.localeCompare(left.startDate),
  );

  return (
    <ol
      className="border-line relative space-y-8 border-l pl-6 sm:pl-10"
      aria-label="Parcours de formation"
    >
      {orderedFormations.map((formation) => (
        <li className="relative" key={formation.id}>
          <span
            className="border-canvas bg-accent absolute top-7 -left-[1.94rem] size-4 rounded-full border-4 sm:-left-[2.94rem]"
            aria-hidden="true"
          />
          <FormationCard formation={formation} />
        </li>
      ))}
    </ol>
  );
}
