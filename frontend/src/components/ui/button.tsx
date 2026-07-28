import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type CommonButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-canvas shadow-[0_12px_36px_rgba(22,28,26,0.18)] hover:-translate-y-0.5 hover:bg-accent-strong focus-visible:outline-ink",
  secondary:
    "border border-line bg-surface/80 text-ink hover:-translate-y-0.5 hover:border-accent hover:bg-surface focus-visible:outline-ink",
  ghost: "text-ink hover:bg-secondary focus-visible:outline-ink",
  danger: "bg-danger text-white hover:bg-danger/90 focus-visible:outline-danger",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-10 px-4 py-2 text-sm",
  md: "min-h-12 px-6 py-3 text-sm",
  lg: "min-h-14 px-8 py-4 text-base",
};

type ButtonLinkProps = CommonButtonProps & {
  href: AnchorHTMLAttributes<HTMLAnchorElement>["href"];
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className" | "href">;

type NativeButtonProps = CommonButtonProps & {
  href?: never;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;

export type ButtonProps = ButtonLinkProps | NativeButtonProps;

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const styles = `inline-flex items-center justify-center rounded-full font-semibold tracking-[-0.01em] transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if ("href" in props && props.href !== undefined) {
    const linkProps = props as Omit<ButtonLinkProps, keyof CommonButtonProps>;
    return (
      <a className={styles} {...linkProps}>
        {children}
      </a>
    );
  }

  const buttonProps = props as Omit<NativeButtonProps, keyof CommonButtonProps>;
  return (
    <button className={styles} type="button" {...buttonProps}>
      {children}
    </button>
  );
}
