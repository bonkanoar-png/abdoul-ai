import { Card } from "@/components/ui/card";

type InsightCardProps = {
  insight: {
    title: string;
    content: string;
  };
};

export function InsightCard({ insight }: InsightCardProps) {
  return (
    <Card className="bg-ink text-canvas">
      <p className="text-accent-light text-sm font-bold tracking-[0.16em] uppercase">
        Analyse simulée
      </p>
      <h2 className="mt-4 text-2xl font-bold tracking-[-0.03em]">{insight.title}</h2>
      <p className="text-canvas/75 mt-5 leading-8">{insight.content}</p>
    </Card>
  );
}
