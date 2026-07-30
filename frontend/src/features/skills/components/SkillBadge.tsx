import { Badge } from "@/components/ui/badge";
import type { Skill } from "@/features/skills/schemas/skill.schema";

type SkillBadgeProps = {
  skill: Skill;
};

export function SkillBadge({ skill }: SkillBadgeProps) {
  return (
    <Badge className="gap-2 px-4 py-2 text-sm" variant="accent">
      {skill.icon ? <span aria-hidden="true">{skill.icon}</span> : null}
      <span>{skill.name}</span>
      {skill.level ? <span className="font-normal opacity-75">· {skill.level}</span> : null}
    </Badge>
  );
}
