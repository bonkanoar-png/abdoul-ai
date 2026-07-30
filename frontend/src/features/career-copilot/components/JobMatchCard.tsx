import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { JobMatch } from "@/features/career-copilot/types/career";

type JobMatchCardProps = {
  job: JobMatch;
};

export function JobMatchCard({ job }: JobMatchCardProps) {
  return (
    <Card>
      <p className="text-accent-strong text-sm font-bold tracking-[0.16em] uppercase">
        Matching poste
      </p>
      <h2 className="text-ink mt-4 text-2xl font-bold tracking-[-0.03em]">{job.title}</h2>
      <p className="text-ink mt-5 text-4xl font-bold">{job.compatibility}%</p>
      <p className="text-muted mt-1">de compatibilité simulée</p>
      <h3 className="text-ink mt-7 font-bold">Compétences à renforcer</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {job.missingSkills.map((skill) => (
          <li key={skill}>
            <Badge variant="neutral">{skill}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
