import type { z } from "zod";

import type { certificationSchema } from "@/schemas/certification";

export type Certification = z.infer<typeof certificationSchema>;
