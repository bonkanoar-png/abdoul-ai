import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Dataset } from "@/features/data-lab/types/dataset";

type DatasetCardProps = {
  dataset: Dataset;
};

export function DatasetCard({ dataset }: DatasetCardProps) {
  return (
    <Card>
      <p className="text-accent-strong text-sm font-bold tracking-[0.16em] uppercase">
        Dataset Explorer
      </p>
      <h2 className="text-ink mt-4 text-3xl font-bold tracking-[-0.04em]">{dataset.name}</h2>
      <p className="text-muted mt-4 max-w-3xl leading-7">{dataset.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Badge variant="accent">{dataset.rows.toLocaleString("fr-FR")} lignes</Badge>
        <Badge variant="neutral">{dataset.columns} variables</Badge>
        <Badge variant="success">Données mock</Badge>
      </div>
    </Card>
  );
}
