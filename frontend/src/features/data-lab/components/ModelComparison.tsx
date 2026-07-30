import { Card } from "@/components/ui/card";
import type { ModelResult } from "@/features/data-lab/types/dataset";

type ModelComparisonProps = {
  models: ModelResult[];
};

export function ModelComparison({ models }: ModelComparisonProps) {
  const percentage = (value: number) => `${Math.round(value * 100)}%`;

  return (
    <Card>
      <h2 className="text-ink text-2xl font-bold tracking-[-0.03em]">Comparaison des modèles</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left">
          <caption className="sr-only">
            Comparaison Accuracy, Precision et Recall des modèles simulés
          </caption>
          <thead>
            <tr className="border-line border-b">
              <th className="px-4 py-3" scope="col">
                Modèle
              </th>
              <th className="px-4 py-3" scope="col">
                Accuracy
              </th>
              <th className="px-4 py-3" scope="col">
                Precision
              </th>
              <th className="px-4 py-3" scope="col">
                Recall
              </th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr className="border-line border-b last:border-0" key={model.name}>
                <th className="text-ink px-4 py-4" scope="row">
                  {model.name}
                </th>
                <td className="text-muted px-4 py-4">{percentage(model.accuracy)}</td>
                <td className="text-muted px-4 py-4">{percentage(model.precision)}</td>
                <td className="text-muted px-4 py-4">{percentage(model.recall)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
