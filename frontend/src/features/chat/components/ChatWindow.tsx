"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { ChatInput } from "@/features/chat/components/ChatInput";
import { MessageBubble } from "@/features/chat/components/MessageBubble";
import { PromptSuggestions } from "@/features/chat/components/PromptSuggestions";
import {
  createMockAssistantMessage,
  createUserMessage,
} from "@/features/chat/services/chat-service";
import type { Message } from "@/features/chat/types/message";

type ChatWindowProps = {
  initialMessages?: Message[];
};

export function ChatWindow({ initialMessages = [] }: ChatWindowProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  function sendMessage(content: string) {
    const now = new Date();
    setMessages((current) => [
      ...current,
      createUserMessage(content, now),
      createMockAssistantMessage(content, new Date(now.getTime() + 1)),
    ]);
    setDraft("");
  }

  return (
    <Card className="flex min-h-[38rem] flex-col">
      <div className="border-line border-b pb-5">
        <h2 className="text-ink text-2xl font-bold tracking-[-0.03em]">Abdoul AI Assistant</h2>
        <p className="text-muted mt-2 text-sm">
          Démonstration locale — aucune question n’est envoyée à une API.
        </p>
      </div>

      <div
        className="flex-1 space-y-4 overflow-y-auto py-6"
        aria-label="Messages de la conversation"
        aria-live="polite"
      >
        {messages.length > 0 ? (
          messages.map((message) => <MessageBubble message={message} key={message.id} />)
        ) : (
          <div className="flex h-full min-h-52 flex-col justify-center">
            <p className="text-ink text-xl font-bold">Comment puis-je vous aider ?</p>
            <p className="text-muted mt-2 leading-7">
              Choisissez une suggestion ou rédigez votre propre question.
            </p>
            <div className="mt-6">
              <PromptSuggestions onSelect={setDraft} />
            </div>
          </div>
        )}
      </div>

      <ChatInput value={draft} onChange={setDraft} onSend={sendMessage} />
    </Card>
  );
}
