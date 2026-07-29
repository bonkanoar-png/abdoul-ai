import type { z } from "zod";

import type { documentSchema } from "@/schemas/document";

export type Document = z.infer<typeof documentSchema>;
export type DocumentType = Document["document_type"];
