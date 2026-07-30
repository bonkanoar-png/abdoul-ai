import { z } from "zod";

export const sourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().min(1),
  snippet: z.string(),
});

export const messageSchema = z.object({
  id: z.string().min(1),
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
  createdAt: z.iso.datetime(),
  sources: z.array(sourceSchema).optional(),
});

export const messagesSchema = z.array(messageSchema);
