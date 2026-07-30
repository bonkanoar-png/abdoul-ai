import { messageSchema } from "@/features/chat/schemas/message.schema";
import type { Message } from "@/features/chat/types/message";

const mockSource = {
  title: "Portfolio d’Abdoul",
  url: "/about",
  snippet: "Parcours, compétences et réalisations professionnelles.",
} as const;

export function createUserMessage(content: string, now = new Date()): Message {
  return messageSchema.parse({
    id: `user-${now.getTime()}`,
    role: "user",
    content,
    createdAt: now.toISOString(),
  });
}

export function createMockAssistantMessage(content: string, now = new Date()): Message {
  return messageSchema.parse({
    id: `assistant-${now.getTime()}`,
    role: "assistant",
    content: `Réponse simulée : j’ai bien reçu votre question « ${content} ». Les réponses détaillées seront disponibles avec l’AI Engine.`,
    createdAt: now.toISOString(),
    sources: [mockSource],
  });
}
