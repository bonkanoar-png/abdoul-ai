import { z } from "zod";

export const messageSchema = z.object({
  id: z.uuid(),
  conversation_id: z.uuid(),
  role: z.enum(["USER", "ASSISTANT", "SYSTEM"]),
  content: z.string(),
  created_at: z.iso.datetime(),
});

export const messagesSchema = z.array(messageSchema);
