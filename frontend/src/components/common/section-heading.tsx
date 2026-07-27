type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto items-center text-center" : "items-start";

  return (
    <div className={`flex max-w-3xl flex-col ${alignment}`}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-strong">{eyebrow}</p>
      <h2 className="mt-4 text-balance text-4xl font-bold leading-tight tracking-[-0.05em] text-ink sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-pretty text-lg leading-8 text-muted">{description}</p>
      ) : null}
    </div>
  );
}
