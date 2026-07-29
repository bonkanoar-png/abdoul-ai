import type { z } from "zod";

import type { technologySchema } from "@/schemas/technology";

export type Technology = z.infer<typeof technologySchema>;
