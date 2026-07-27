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
      <p className="text-accent-strong text-xs font-bold tracking-[0.2em] uppercase">{eyebrow}</p>
      <h2 className="text-ink mt-4 text-4xl leading-tight font-bold tracking-[-0.05em] text-balance sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="text-muted mt-5 text-lg leading-8 text-pretty">{description}</p>
      ) : null}
    </div>
  );
}
