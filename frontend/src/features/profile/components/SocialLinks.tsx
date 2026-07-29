import type { Profile } from "@/types/profile";

type SocialLinksProps = Pick<Profile, "email" | "github_url" | "linkedin_url">;

function safeExternalUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function SocialLinks({ email, github_url, linkedin_url }: SocialLinksProps) {
  const links = [
    { label: "Email", href: `mailto:${email}`, external: false },
    { label: "LinkedIn", href: safeExternalUrl(linkedin_url), external: true },
    { label: "GitHub", href: safeExternalUrl(github_url), external: true },
  ].filter((link): link is { label: string; href: string; external: boolean } =>
    Boolean(link.href),
  );

  return (
    <nav aria-label="Liens du profil">
      <ul className="flex flex-wrap gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              className="border-line bg-canvas text-ink hover:border-accent hover:text-accent-strong inline-flex min-h-11 items-center rounded-full border px-5 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-4"
              href={link.href}
              rel={link.external ? "noreferrer" : undefined}
              target={link.external ? "_blank" : undefined}
            >
              {link.label}
              {link.external ? <span className="sr-only"> (nouvelle fenêtre)</span> : null}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
