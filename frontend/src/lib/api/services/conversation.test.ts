import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api/client";
import { getConversations } from "@/lib/api/services/conversation";
import { getConversationMessages } from "@/lib/api/services/message";

const conversationId = "123e4567-e89b-42d3-a456-426614174003";
const message = {
  id: "123e4567-e89b-42d3-a456-426614174004",
  conversation_id: conversationId,
  role: "USER",
  content: "Hello",
  created_at: "2026-07-01T10:00:00Z",
};

describe("conversation services", () => {
  afterEach(() => vi.restoreAllMocks());

  it("accepts a nullable title and validates nested messages", async () => {
    const conversation = {
      id: conversationId,
      session_id: "browser-session",
      title: null,
      created_at: "2026-07-01T10:00:00Z",
      updated_at: "2026-07-02T10:00:00Z",
      messages: [message],
    };
    vi.spyOn(apiClient, "get").mockResolvedValue([conversation]);

    await expect(getConversations()).resolves.toEqual([conversation]);
  });

  it("loads messages from the conversation endpoint", async () => {
    vi.spyOn(apiClient, "get").mockResolvedValue([message]);

    await expect(getConversationMessages(conversationId)).resolves.toEqual([message]);
    expect(apiClient.get).toHaveBeenCalledWith(`/api/v1/conversations/${conversationId}/messages`);
  });

  it("rejects an unsupported message role", async () => {
    vi.spyOn(apiClient, "get").mockResolvedValue([{ ...message, role: "TOOL" }]);

    await expect(getConversationMessages(conversationId)).rejects.toMatchObject({
      name: "ZodError",
    });
  });
});
