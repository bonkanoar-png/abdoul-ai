import { Card } from "@/components/ui/card";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { SocialLinks } from "@/features/profile/components/SocialLinks";
import type { Profile } from "@/types/profile";

type ProfileCardProps = {
  profile: Profile;
};

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <article aria-labelledby="profile-biography">
      <Card className="p-7 sm:p-10 lg:p-12">
        <ProfileHeader profile={profile} />
        <div className="border-line mt-8 border-t pt-8">
          <h2 className="text-ink text-2xl font-bold tracking-[-0.03em]" id="profile-biography">
            À propos
          </h2>
          <p className="text-muted mt-4 max-w-3xl text-lg leading-8">{profile.bio}</p>
          <div className="mt-8">
            <SocialLinks
              email={profile.email}
              github_url={profile.github_url}
              linkedin_url={profile.linkedin_url}
            />
          </div>
        </div>
      </Card>
    </article>
  );
}
