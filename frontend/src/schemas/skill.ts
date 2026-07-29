import { z } from "zod";

export const skillSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  category: z.string(),
  sort_order: z.number().int(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const skillsSchema = z.array(skillSchema);
