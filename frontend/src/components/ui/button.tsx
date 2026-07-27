import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  children: ReactNode;
  href: `#${string}`;
  variant?: ButtonVariant;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href">;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-canvas shadow-[0_12px_36px_rgba(22,28,26,0.18)] hover:-translate-y-0.5 hover:bg-accent-strong focus-visible:outline-ink",
  secondary:
    "border border-line bg-surface/80 text-ink hover:-translate-y-0.5 hover:border-accent hover:bg-surface focus-visible:outline-ink",
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <a
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-[-0.01em] transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 ${variantStyles[variant]} ${className}`}
      href={href}
      {...props}
    >
      {children}
    </a>
  );
}
