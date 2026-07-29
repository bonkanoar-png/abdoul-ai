import { z } from "zod";

export const publicationSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  content: z.string(),
  url: z.url().nullable(),
  publication_type: z.string(),
  published_at: z.iso.datetime(),
  sort_order: z.number().int(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const publicationsSchema = z.array(publicationSchema);
