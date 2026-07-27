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
    <section className="scroll-mt-10 border-y border-line bg-surface py-24 sm:py-32" id="principes">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Expertises"
          title="Un socle technique au service de l’expérience."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {Array.from(skillsByCategory, ([category, categorySkills]) => (
            <article className="min-h-56 bg-canvas p-7 sm:p-9" key={category}>
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-accent-strong">
                {category}
              </h3>
              <ul className="mt-8 space-y-3">
                {categorySkills.map((skill) => (
                  <li className="text-lg font-semibold tracking-[-0.02em] text-ink" key={skill.id}>
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
