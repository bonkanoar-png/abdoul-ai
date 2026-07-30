import { describe, expect, it } from "vitest";

import {
  createMockAssistantMessage,
  createUserMessage,
} from "@/features/chat/services/chat-service";

describe("chat-service", () => {
  const now = new Date("2026-07-30T10:00:00Z");

  it("creates a deterministic validated user message", () => {
    expect(createUserMessage("Quels projets IA ?", now)).toEqual({
      id: `user-${now.getTime()}`,
      role: "user",
      content: "Quels projets IA ?",
      createdAt: now.toISOString(),
    });
  });

  it("creates a local assistant answer with prepared sources", () => {
    const message = createMockAssistantMessage("Quels projets IA ?", now);

    expect(message.role).toBe("assistant");
    expect(message.content).toContain("Réponse simulée");
    expect(message.sources).toEqual([
      {
        title: "Portfolio d’Abdoul",
        url: "/about",
        snippet: "Parcours, compétences et réalisations professionnelles.",
      },
    ]);
  });

  it("rejects empty content through the message schema", () => {
    expect(() => createUserMessage("", now)).toThrow();
  });
});
