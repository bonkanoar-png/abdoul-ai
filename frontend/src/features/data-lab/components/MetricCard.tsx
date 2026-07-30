import { Card } from "@/components/ui/card";
import type { Metric } from "@/features/data-lab/types/dataset";

type MetricCardProps = {
  metric: Metric;
};

export function MetricCard({ metric }: MetricCardProps) {
  return (
    <Card>
      <h2 className="text-muted text-sm font-bold tracking-[0.12em] uppercase">{metric.label}</h2>
      <p className="text-ink mt-3 text-4xl font-bold tracking-[-0.04em]">{metric.value}</p>
      <p className="text-muted mt-2 text-sm">{metric.description}</p>
    </Card>
  );
}
