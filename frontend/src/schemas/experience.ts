import { z } from "zod";

export const experienceSchema = z.object({
  id: z.uuid(),
  profile_id: z.uuid(),
  company: z.string(),
  role: z.string(),
  description: z.string(),
  start_date: z.iso.date(),
  end_date: z.iso.date().nullable(),
  is_current: z.boolean(),
  sort_order: z.number().int(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const experiencesSchema = z.array(experienceSchema);
