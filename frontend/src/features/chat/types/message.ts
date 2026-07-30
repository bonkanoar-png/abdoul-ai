import type { z } from "zod";

import type { messageSchema, sourceSchema } from "@/features/chat/schemas/message.schema";

export type Message = z.infer<typeof messageSchema>;
export type MessageSource = z.infer<typeof sourceSchema>;
