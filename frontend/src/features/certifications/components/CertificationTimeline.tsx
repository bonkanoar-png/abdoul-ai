import { CertificationCard } from "@/features/certifications/components/CertificationCard";
import type { Certification } from "@/features/certifications/schemas/certification.schema";

type CertificationTimelineProps = {
  certifications: Certification[];
};

export function CertificationTimeline({ certifications }: CertificationTimelineProps) {
  return (
    <ol className="border-line space-y-6 border-l pl-6 sm:pl-10" aria-label="Certifications">
      {certifications.map((certification) => (
        <li className="relative" key={certification.id}>
          <span
            className="border-canvas bg-accent absolute top-7 -left-[1.94rem] size-4 rounded-full border-4 sm:-left-[2.94rem]"
            aria-hidden="true"
          />
          <CertificationCard certification={certification} />
        </li>
      ))}
    </ol>
  );
}
