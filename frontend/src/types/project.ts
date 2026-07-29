import type { z } from "zod";

import type { projectSchema } from "@/schemas/project";

export type Project = z.infer<typeof projectSchema>;
