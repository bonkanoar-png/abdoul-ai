import type { ReactNode } from "react";

type ErrorStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function ErrorState({ title, description, action }: ErrorStateProps) {
  return (
    <div
      className="border-danger/25 bg-danger/5 rounded-[var(--radius-lg)] border p-8 text-center sm:p-12"
      role="alert"
    >
      <h2 className="text-danger text-2xl font-bold tracking-tight">{title}</h2>
      <p className="text-muted mx-auto mt-3 max-w-xl leading-7">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
