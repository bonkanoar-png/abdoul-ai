import { z } from "zod";

export const apiErrorDetailSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().nullable(),
});

export const apiErrorResponseSchema = z.object({
  error: apiErrorDetailSchema,
});
