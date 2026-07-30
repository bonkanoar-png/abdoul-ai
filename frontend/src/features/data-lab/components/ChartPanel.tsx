import { Card } from "@/components/ui/card";
import type { ChartData } from "@/features/data-lab/types/dataset";

type ChartPanelProps = {
  chart: ChartData;
};

export function ChartPanel({ chart }: ChartPanelProps) {
  return (
    <Card>
      <h2 className="text-ink text-2xl font-bold tracking-[-0.03em]">{chart.title}</h2>
      <p className="sr-only">{chart.description}</p>
      <div className="mt-7 space-y-4" role="img" aria-label={chart.description}>
        {chart.values.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex justify-between gap-4 text-sm">
              <span className="text-ink font-semibold">{item.label}</span>
              <span className="text-muted">{item.value}%</span>
            </div>
            <div className="bg-secondary h-4 overflow-hidden rounded-full">
              <div className="bg-accent h-full rounded-full" style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
