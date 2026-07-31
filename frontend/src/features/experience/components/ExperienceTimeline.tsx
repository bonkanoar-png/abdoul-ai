import { ExperienceCard } from "@/features/experience/components/ExperienceCard";
import type { Experience } from "@/features/experience/schemas/experience.schema";

type ExperienceTimelineProps = {
  experiences: Experience[];
};

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const orderedExperiences = [...experiences].sort((left, right) =>
    right.start_date.localeCompare(left.start_date),
  );

  return (
    <ol
      className="border-line relative space-y-8 border-l pl-6 sm:pl-10"
      aria-label="Parcours professionnel"
    >
      {orderedExperiences.map((experience) => (
        <li className="relative" key={experience.id}>
          <span
            className="border-canvas bg-accent absolute top-7 -left-[1.94rem] size-4 rounded-full border-4 sm:-left-[2.94rem]"
            aria-hidden="true"
          />
          <ExperienceCard experience={experience} />
        </li>
      ))}
    </ol>
  );
}
