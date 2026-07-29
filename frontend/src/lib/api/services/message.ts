import { apiClient } from "@/lib/api/client";
import { messagesSchema } from "@/schemas/message";
import type { Message } from "@/types/message";
import type { Uuid } from "@/types/common";

export async function getConversationMessages(conversationId: Uuid): Promise<Message[]> {
  return messagesSchema.parse(
    await apiClient.get(`/api/v1/conversations/${encodeURIComponent(conversationId)}/messages`),
  );
}
