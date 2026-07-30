import { Card } from "@/components/ui/card";

type RecommendationPanelProps = {
  recommendations: string[];
};

export function RecommendationPanel({ recommendations }: RecommendationPanelProps) {
  return (
    <Card>
      <h2 className="text-ink text-2xl font-bold tracking-[-0.03em]">Recommandations</h2>
      <ol className="mt-6 space-y-4">
        {recommendations.map((recommendation, index) => (
          <li className="flex gap-3" key={recommendation}>
            <span
              className="bg-accent-soft text-accent-strong flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <p className="text-muted pt-1 leading-7">{recommendation}</p>
          </li>
        ))}
      </ol>
      <p className="text-muted mt-6 text-xs">Recommandations de démonstration uniquement.</p>
    </Card>
  );
}
