import type { z } from "zod";

import type {
  chartSchema,
  dataLabSchema,
  datasetSchema,
  dataTableSchema,
  metricSchema,
  modelSchema,
} from "@/features/data-lab/schemas/dataset.schema";

export type ChartData = z.infer<typeof chartSchema>;
export type DataLab = z.infer<typeof dataLabSchema>;
export type Dataset = z.infer<typeof datasetSchema>;
export type DataTableData = z.infer<typeof dataTableSchema>;
export type Metric = z.infer<typeof metricSchema>;
export type ModelResult = z.infer<typeof modelSchema>;
