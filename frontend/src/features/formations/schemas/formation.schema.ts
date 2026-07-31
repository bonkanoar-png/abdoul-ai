import { z } from "zod";

export const formationFieldSchema = z.enum([
  "Intelligence artificielle",
  "Data Science",
  "Statistiques mathématiques",
  "Mathématiques appliquées",
]);

export const formationSchema = z
  .object({
    id: z.uuid(),
    degree: z.string().min(1),
    field: formationFieldSchema,
    institution: z.string().min(1),
    location: z.string().min(1),
    startDate: z.iso.date(),
    endDate: z.iso.date().nullable(),
    status: z.enum(["Obtenu", "En cours"]),
    description: z.string().min(1),
    highlights: z.array(z.string().min(1)).min(1),
    skills: z.array(z.string().min(1)).min(1),
    technologies: z.array(z.string().min(1)).optional(),
    projects: z.array(z.string().min(1)).optional(),
    logo: z.url().optional(),
    website: z.url().optional(),
    mention: z.string().min(1).optional(),
  })
  .refine(({ startDate, endDate }) => endDate === null || endDate >= startDate, {
    message: "La date de fin doit être postérieure à la date de début",
    path: ["endDate"],
  });

export const formationsSchema = z.array(formationSchema);
