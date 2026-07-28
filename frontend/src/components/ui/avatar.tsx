type AvatarProps = {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "size-10 text-sm",
  md: "size-14 text-base",
  lg: "size-20 text-xl",
} as const;

export function Avatar({ name, src, size = "md" }: AvatarProps) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <span
      className={`bg-secondary text-primary inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold ${sizes[size]}`}
    >
      {src ? (
        // The primitive accepts trusted or already validated image sources.
        // eslint-disable-next-line @next/next/no-img-element
        <img className="size-full object-cover" src={src} alt={name} />
      ) : (
        <span aria-label={name}>{initials || "?"}</span>
      )}
    </span>
  );
}
