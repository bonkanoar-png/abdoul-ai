import type { z } from "zod";

import type { publicationSchema } from "@/schemas/publication";

export type Publication = z.infer<typeof publicationSchema>;
