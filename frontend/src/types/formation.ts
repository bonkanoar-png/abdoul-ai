import type { z } from "zod";

import type { formationSchema } from "@/schemas/formation";

export type Formation = z.infer<typeof formationSchema>;
