import { SkillCategory } from "@/features/skills/components/SkillCategory";
import type { Skill } from "@/features/skills/schemas/skill.schema";

type SkillGridProps = {
  skills: Skill[];
};

export function SkillGrid({ skills }: SkillGridProps) {
  const skillsByCategory = Map.groupBy(skills, (skill) => skill.category);

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {Array.from(skillsByCategory, ([category, categorySkills]) => (
        <SkillCategory category={category} skills={categorySkills} key={category} />
      ))}
    </div>
  );
}
