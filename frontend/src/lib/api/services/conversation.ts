import { apiClient } from "@/lib/api/client";
import { conversationsSchema } from "@/schemas/conversation";
import type { Conversation } from "@/types/conversation";

export async function getConversations(): Promise<Conversation[]> {
  return conversationsSchema.parse(await apiClient.get("/api/v1/conversations"));
}
