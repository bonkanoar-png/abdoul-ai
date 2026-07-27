import { SectionHeading } from "@/components/common/section-heading";
import { Container } from "@/components/ui/container";
import type { Profile } from "@/types/portfolio";

type ProfileOverviewProps = {
  profile: Profile;
};

export function ProfileOverview({ profile }: ProfileOverviewProps) {
  return (
    <section className="scroll-mt-10 py-24 sm:py-32" id="approche">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <p className="text-accent-strong text-xs font-bold tracking-[0.2em] uppercase">
              Profil
            </p>
            <p className="text-muted mt-4 text-sm font-semibold tracking-[0.12em] uppercase">
              {profile.location}
            </p>
          </div>
          <SectionHeading eyebrow={profile.name} title={profile.title} description={profile.bio} />
        </div>
      </Container>
    </section>
  );
}
