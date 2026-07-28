import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="border-line bg-surface rounded-[var(--radius-lg)] border border-dashed p-8 text-center sm:p-12">
      <h2 className="text-foreground text-2xl font-bold tracking-tight">{title}</h2>
      <p className="text-muted mx-auto mt-3 max-w-xl leading-7">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
