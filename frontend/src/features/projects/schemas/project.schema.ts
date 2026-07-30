import { z } from "zod";

export const projectTechnologySchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  category: z.string().min(1),
  icon_url: z.url().nullable(),
  sort_order: z.number().int(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const projectSchema = z.object({
  id: z.uuid(),
  profile_id: z.uuid().optional(),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  short_description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  technologies: z.array(projectTechnologySchema),
  category: z.string().nullable().optional(),
  image_url: z.url().nullable(),
  github_url: z.url().nullable(),
  demo_url: z.url().nullable(),
  is_featured: z.boolean().optional(),
  sort_order: z.number().int().optional(),
  created_at: z.iso.datetime().optional(),
  updated_at: z.iso.datetime().optional(),
});

export const projectsSchema = z.array(projectSchema);

export type Project = z.infer<typeof projectSchema>;
export type ProjectTechnology = z.infer<typeof projectTechnologySchema>;
