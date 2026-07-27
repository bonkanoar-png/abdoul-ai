import { SectionHeading } from "@/components/common/section-heading";
import { Container } from "@/components/ui/container";
import type { Skill } from "@/types/portfolio";

type SkillListProps = {
  skills: Skill[];
};

export function SkillList({ skills }: SkillListProps) {
  if (skills.length === 0) {
    return null;
  }

  const skillsByCategory = Map.groupBy(skills, (skill) => skill.category);

  return (
    <section className="border-line bg-surface scroll-mt-10 border-y py-24 sm:py-32" id="principes">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Expertises"
          title="Un socle technique au service de l’expérience."
        />

        <div className="border-line bg-line mt-14 grid gap-px overflow-hidden rounded-[2rem] border sm:grid-cols-2 lg:grid-cols-3">
          {Array.from(skillsByCategory, ([category, categorySkills]) => (
            <article className="bg-canvas min-h-56 p-7 sm:p-9" key={category}>
              <h3 className="text-accent-strong text-sm font-bold tracking-[0.16em] uppercase">
                {category}
              </h3>
              <ul className="mt-8 space-y-3">
                {categorySkills.map((skill) => (
                  <li className="text-ink text-lg font-semibold tracking-[-0.02em]" key={skill.id}>
                    {skill.name}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
