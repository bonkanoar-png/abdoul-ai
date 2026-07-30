import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import {
  ChartPanel,
  DatasetCard,
  DataTable,
  InsightCard,
  MetricCard,
  ModelComparison,
} from "@/features/data-lab";
import { getMockDataLab } from "@/features/data-lab/services/data-lab-service";

export const metadata: Metadata = {
  title: { absolute: "Data Lab — Abdoul AI" },
  description:
    "Laboratoire interactif présentant des analyses de données, visualisations et expériences machine learning.",
};

export default function DataLabPage() {
  const lab = getMockDataLab();

  return (
    <main>
      <Section className="pt-24 sm:pt-28" aria-labelledby="data-lab-title">
        <Container>
          <div className="max-w-4xl">
            <p className="text-accent-strong text-xs font-bold tracking-[0.2em] uppercase">
              Expérience Data
            </p>
            <h1
              className="text-ink mt-4 text-5xl leading-tight font-bold tracking-[-0.05em] text-balance sm:text-6xl"
              id="data-lab-title"
            >
              Data Lab
            </h1>
            <p className="text-muted mt-6 max-w-3xl text-xl leading-9 text-pretty">
              Explorez un laboratoire interactif simulant analyses, visualisations et comparaison de
              modèles Machine Learning.
            </p>
          </div>

          <div className="mt-14">
            <DatasetCard dataset={lab.dataset} />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {lab.metrics.map((metric) => (
              <MetricCard metric={metric} key={metric.label} />
            ))}
          </div>
          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.7fr]">
            <ChartPanel chart={lab.chart} />
            <InsightCard insight={lab.insight} />
          </div>
          <div className="mt-6">
            <DataTable table={lab.table} />
          </div>
          <div className="mt-6">
            <ModelComparison models={lab.models} />
          </div>
        </Container>
      </Section>
    </main>
  );
}
