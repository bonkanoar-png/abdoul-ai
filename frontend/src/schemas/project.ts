import { z } from "zod";

import { technologySchema } from "@/schemas/technology";

export const projectSchema = z.object({
  id: z.uuid(),
  profile_id: z.uuid(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  content: z.string(),
  github_url: z.url().nullable(),
  demo_url: z.url().nullable(),
  image_url: z.url().nullable(),
  is_featured: z.boolean(),
  sort_order: z.number().int(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  technologies: z.array(technologySchema),
});

export const projectsSchema = z.array(projectSchema);
