import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type RoutePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function RoutePlaceholder({ eyebrow, title, description }: RoutePlaceholderProps) {
  return (
    <main>
      <PageContainer>
        <Card className="mx-auto max-w-3xl text-center">
          <Badge variant="accent">{eyebrow}</Badge>
          <h1 className="text-foreground mt-6 text-4xl font-bold tracking-[-0.05em] text-balance sm:text-5xl">
            {title}
          </h1>
          <p className="text-muted mx-auto mt-5 max-w-2xl text-lg leading-8 text-pretty">
            {description}
          </p>
        </Card>
      </PageContainer>
    </main>
  );
}
