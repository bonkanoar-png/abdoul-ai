import { z } from "zod";

export const certificationSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  issuer: z.string().min(1),
  issued_at: z.iso.date(),
  date: z.iso.date().optional(),
  credential_url: z.url().nullable(),
  description: z.string().nullable().optional(),
  expiration_date: z.iso.date().nullable().optional(),
  sort_order: z.number().int().optional(),
  created_at: z.iso.datetime().optional(),
  updated_at: z.iso.datetime().optional(),
});

export const certificationsSchema = z.array(certificationSchema);

export type Certification = z.infer<typeof certificationSchema>;
