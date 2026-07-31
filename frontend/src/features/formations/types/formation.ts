import type { z } from "zod";

import type {
  formationSchema,
  formationTypeSchema,
} from "@/features/formations/schemas/formation.schema";

export type Formation = z.infer<typeof formationSchema>;
export type FormationType = z.infer<typeof formationTypeSchema>;
