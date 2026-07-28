import type { ComponentPropsWithoutRef } from "react";

export function Section({ className = "", ...props }: ComponentPropsWithoutRef<"section">) {
  return <section className={`py-16 sm:py-24 lg:py-32 ${className}`} {...props} />;
}
