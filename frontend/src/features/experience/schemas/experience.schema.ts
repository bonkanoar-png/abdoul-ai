import { z } from "zod";

export const experienceSchema = z.object({
  id: z.uuid(),
  profile_id: z.uuid(),
  company: z.string().min(1),
  role: z.string().min(1),
  description: z.string(),
  start_date: z.iso.date(),
  end_date: z.iso.date().nullable(),
  is_current: z.boolean(),
  sort_order: z.number().int(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  location: z.string().nullable().optional(),
  technologies: z.array(z.string()).nullable().optional(),
  contract_type: z.string().min(1).optional(),
  missions: z.array(z.string().min(1)).optional(),
  results: z.array(z.string().min(1)).optional(),
  skills: z.array(z.string().min(1)).optional(),
  environment: z.array(z.string().min(1)).optional(),
  publication: z.string().min(1).optional(),
});

export const experiencesSchema = z.array(experienceSchema);

export type Experience = z.infer<typeof experienceSchema>;
