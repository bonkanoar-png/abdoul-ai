import { z } from "zod";

export const publicationSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1),
  slug: z.string().min(1),
  summary: z.string(),
  content: z.string(),
  published_at: z.iso.datetime(),
  url: z.url().nullable(),
  tags: z.array(z.string()).nullable().optional(),
  publication_type: z.string().optional(),
  sort_order: z.number().int().optional(),
  created_at: z.iso.datetime().optional(),
  updated_at: z.iso.datetime().optional(),
});

export const publicationsSchema = z.array(publicationSchema);

export type Publication = z.infer<typeof publicationSchema>;
