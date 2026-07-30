import { z } from "zod";

export const datasetSchema = z.object({
  name: z.string().min(1),
  rows: z.number().int().nonnegative(),
  columns: z.number().int().nonnegative(),
  description: z.string(),
});

export const metricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  description: z.string(),
});

export const dataTableSchema = z.object({
  headers: z.array(z.string().min(1)),
  rows: z.array(z.array(z.string())),
  caption: z.string().min(1),
});

export const chartSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  values: z.array(z.object({ label: z.string(), value: z.number().min(0).max(100) })),
});

export const modelSchema = z.object({
  name: z.string().min(1),
  accuracy: z.number().min(0).max(1),
  precision: z.number().min(0).max(1),
  recall: z.number().min(0).max(1),
});

export const dataLabSchema = z.object({
  dataset: datasetSchema,
  metrics: z.array(metricSchema),
  table: dataTableSchema,
  chart: chartSchema,
  models: z.array(modelSchema),
  insight: z.object({ title: z.string(), content: z.string() }),
});
