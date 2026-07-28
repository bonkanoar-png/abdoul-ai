import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`border-line bg-surface rounded-[var(--radius-lg)] border p-6 shadow-[0_20px_60px_rgba(23,32,29,0.06)] ${className}`}
      {...props}
    />
  );
}
