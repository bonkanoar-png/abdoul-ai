import type { z } from "zod";

import type {
  formationFieldSchema,
  formationSchema,
} from "@/features/formations/schemas/formation.schema";

export type Formation = z.infer<typeof formationSchema>;
export type FormationField = z.infer<typeof formationFieldSchema>;
