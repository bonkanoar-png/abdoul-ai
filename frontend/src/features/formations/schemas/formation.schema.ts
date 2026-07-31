import { z } from "zod";

const yearSchema = z.string().regex(/^\d{4}$/, "Une année au format YYYY est attendue");

export const formationTypeSchema = z.enum([
  "Intelligence artificielle",
  "Data Science",
  "Mathématiques",
]);

export const formationSchema = z
  .object({
    id: z.uuid(),
    title: z.string().min(1),
    degree: z.string().min(1),
    institution: z.string().min(1),
    location: z.string().min(1),
    startDate: yearSchema,
    endDate: yearSchema.nullable(),
    description: z.string().min(1),
    skills: z.array(z.string().min(1)).min(1),
    type: formationTypeSchema,
    website: z.url().optional(),
    mention: z.string().min(1).optional(),
    credential: z.string().min(1).optional(),
  })
  .refine(({ startDate, endDate }) => endDate === null || Number(endDate) >= Number(startDate), {
    message: "La date de fin doit être postérieure à la date de début",
    path: ["endDate"],
  });

export const formationsSchema = z.array(formationSchema);
