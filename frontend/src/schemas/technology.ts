import { z } from "zod";

export const technologySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  category: z.string(),
  icon_url: z.url().nullable(),
  sort_order: z.number().int(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const technologiesSchema = z.array(technologySchema);
