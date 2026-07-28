import type { HTMLAttributes } from "react";

type BadgeVariant = "neutral" | "accent" | "success" | "danger";

const variants: Record<BadgeVariant, string> = {
  neutral: "bg-secondary text-foreground",
  accent: "bg-accent-soft text-accent-strong",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({ className = "", variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
