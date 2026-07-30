import { Card } from "@/components/ui/card";
import { SkillBadge } from "@/features/skills/components/SkillBadge";
import type { Skill } from "@/features/skills/schemas/skill.schema";

type SkillCategoryProps = {
  category: string;
  skills: Skill[];
};

export function SkillCategory({ category, skills }: SkillCategoryProps) {
  return (
    <article aria-labelledby={`skill-category-${category.replaceAll(" ", "-").toLowerCase()}`}>
      <Card className="h-full">
        <h2
          className="text-ink text-xl font-bold tracking-[-0.03em]"
          id={`skill-category-${category.replaceAll(" ", "-").toLowerCase()}`}
        >
          {category}
        </h2>
        <ul className="mt-6 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li key={skill.id}>
              <SkillBadge skill={skill} />
            </li>
          ))}
        </ul>
      </Card>
    </article>
  );
}
