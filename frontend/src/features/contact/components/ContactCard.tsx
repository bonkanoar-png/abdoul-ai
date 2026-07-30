import { Card } from "@/components/ui/card";
import { SocialLinks } from "@/features/profile";
import type { Profile } from "@/types/profile";

type ContactCardProps = {
  profile: Profile | null;
};

export function ContactCard({ profile }: ContactCardProps) {
  return (
    <aside aria-labelledby="direct-contact-title">
      <Card className="h-full">
        <h2 className="text-ink text-2xl font-bold tracking-[-0.03em]" id="direct-contact-title">
          Coordonnées
        </h2>
        {profile ? (
          <>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-muted text-sm font-semibold">Email</dt>
                <dd className="text-ink mt-1 break-all">{profile.email}</dd>
              </div>
              <div>
                <dt className="text-muted text-sm font-semibold">Localisation</dt>
                <dd className="text-ink mt-1">{profile.location}</dd>
              </div>
            </dl>
            <div className="mt-8">
              <SocialLinks
                email={profile.email}
                github_url={profile.github_url}
                linkedin_url={profile.linkedin_url}
              />
            </div>
          </>
        ) : (
          <p className="text-muted mt-5 leading-7">
            Les coordonnées sont momentanément indisponibles. Utilisez le formulaire pour préparer
            votre message.
          </p>
        )}
      </Card>
    </aside>
  );
}
