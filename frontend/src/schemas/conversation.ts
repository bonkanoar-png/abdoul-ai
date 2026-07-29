import { z } from "zod";

import { messageSchema } from "@/schemas/message";

export const conversationSchema = z.object({
  id: z.uuid(),
  session_id: z.string(),
  title: z.string().nullable(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  messages: z.array(messageSchema),
});

export const conversationsSchema = z.array(conversationSchema);
