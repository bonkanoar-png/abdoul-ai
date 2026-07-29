import { z } from "zod";

export const formationSchema = z.object({
  id: z.uuid(),
  profile_id: z.uuid(),
  institution: z.string(),
  degree: z.string(),
  field_of_study: z.string().nullable(),
  description: z.string(),
  start_date: z.iso.date(),
  end_date: z.iso.date().nullable(),
  is_current: z.boolean(),
  sort_order: z.number().int(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const formationsSchema = z.array(formationSchema);
