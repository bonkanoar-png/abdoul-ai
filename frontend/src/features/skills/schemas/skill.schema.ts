import { z } from "zod";

export const skillSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  category: z.string().min(1),
  sort_order: z.number().int(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  level: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
});

export const skillsSchema = z.array(skillSchema);

export type Skill = z.infer<typeof skillSchema>;
