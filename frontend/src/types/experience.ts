import type { z } from "zod";

import type { experienceSchema } from "@/schemas/experience";

export type Experience = z.infer<typeof experienceSchema>;
