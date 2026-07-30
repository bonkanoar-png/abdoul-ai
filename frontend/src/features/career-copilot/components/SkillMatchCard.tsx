import { Card } from "@/components/ui/card";
import type { SkillMatch } from "@/features/career-copilot/types/career";

type SkillMatchCardProps = {
  skill: SkillMatch;
};

export function SkillMatchCard({ skill }: SkillMatchCardProps) {
  return (
    <Card>
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-ink text-lg font-bold">{skill.name}</h2>
          <p className="text-muted mt-1 text-sm">{skill.level}</p>
        </div>
        <p className="text-accent-strong text-xl font-bold">{skill.match}% match</p>
      </div>
      <div
        className="bg-secondary mt-4 h-2 overflow-hidden rounded-full"
        role="progressbar"
        aria-label={`Correspondance ${skill.name}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={skill.match}
      >
        <div className="bg-accent h-full rounded-full" style={{ width: `${skill.match}%` }} />
      </div>
    </Card>
  );
}
