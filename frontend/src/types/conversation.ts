import type { z } from "zod";

import type { conversationSchema } from "@/schemas/conversation";

export type Conversation = z.infer<typeof conversationSchema>;
