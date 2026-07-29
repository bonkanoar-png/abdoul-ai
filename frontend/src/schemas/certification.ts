import { z } from "zod";

export const certificationSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  issuer: z.string(),
  credential_url: z.url().nullable(),
  issued_at: z.iso.date(),
  expiration_date: z.iso.date().nullable(),
  sort_order: z.number().int(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const certificationsSchema = z.array(certificationSchema);
