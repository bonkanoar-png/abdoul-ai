import { z } from "zod";

export const documentSchema = z.object({
  id: z.uuid(),
  profile_id: z.uuid(),
  title: z.string(),
  description: z.string(),
  document_type: z.enum(["CV", "PORTFOLIO", "REPORT", "CERTIFICATE", "OTHER"]),
  file_name: z.string(),
  file_url: z.url(),
  mime_type: z.string(),
  file_size: z.number().int(),
  is_public: z.boolean(),
  sort_order: z.number().int(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const documentsSchema = z.array(documentSchema);
