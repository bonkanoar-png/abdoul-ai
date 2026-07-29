import type { z } from "zod";

import type { skillSchema } from "@/schemas/skill";

export type Skill = z.infer<typeof skillSchema>;
