import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return <Container className={`pt-32 pb-20 sm:pt-36 sm:pb-24 ${className}`}>{children}</Container>;
}
