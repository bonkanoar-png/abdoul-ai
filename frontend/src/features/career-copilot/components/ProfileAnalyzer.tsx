import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ProfileAnalysis } from "@/features/career-copilot/types/career";

type ProfileAnalyzerProps = {
  profile: ProfileAnalysis;
};

export function ProfileAnalyzer({ profile }: ProfileAnalyzerProps) {
  return (
    <Card>
      <h2 className="text-ink text-2xl font-bold tracking-[-0.03em]">Analyse du profil</h2>
      <div className="mt-6 space-y-6">
        <section aria-labelledby="detected-skills">
          <h3 className="text-ink font-bold" id="detected-skills">
            Compétences détectées
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <li key={skill}>
                <Badge variant="accent">{skill}</Badge>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="detected-domains">
          <h3 className="text-ink font-bold" id="detected-domains">
            Domaines
          </h3>
          <ul className="text-muted mt-3 list-disc space-y-2 pl-5">
            {profile.domains.map((domain) => (
              <li key={domain}>{domain}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="detected-experiences">
          <h3 className="text-ink font-bold" id="detected-experiences">
            Expériences
          </h3>
          <ul className="text-muted mt-3 list-disc space-y-2 pl-5">
            {profile.experiences.map((experience) => (
              <li key={experience}>{experience}</li>
            ))}
          </ul>
        </section>
      </div>
    </Card>
  );
}
