import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/types/profile";

type ProfileHeaderProps = {
  profile: Pick<Profile, "avatar_url" | "location" | "name" | "title">;
};

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <Avatar name={profile.name} src={profile.avatar_url} size="lg" />
      <div>
        <Badge variant="accent">{profile.location}</Badge>
        <h1 className="text-ink mt-4 text-4xl font-bold tracking-[-0.05em] text-balance sm:text-5xl">
          {profile.name}
        </h1>
        <p className="text-muted mt-2 text-lg font-semibold">{profile.title}</p>
      </div>
    </header>
  );
}
