import type { z } from "zod";

import type { apiErrorDetailSchema, apiErrorResponseSchema } from "@/schemas/api";

export type ApiErrorDetail = z.infer<typeof apiErrorDetailSchema>;
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
