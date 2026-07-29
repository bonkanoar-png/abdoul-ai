import { z } from "zod";

export const profileSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  title: z.string(),
  bio: z.string(),
  location: z.string(),
  email: z.email(),
  github_url: z.url().nullable(),
  linkedin_url: z.url().nullable(),
  avatar_url: z.url().nullable(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});
