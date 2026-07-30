import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MessageBubble } from "@/features/chat";
import type { Message } from "@/features/chat/types/message";

const userMessage = {
  id: "user-1",
  role: "user",
  content: "Quels sont ses projets ?",
  createdAt: "2026-07-30T10:00:00Z",
} satisfies Message;

describe("MessageBubble", () => {
  it("renders a user message", () => {
    render(<MessageBubble message={userMessage} />);

    expect(screen.getByRole("article", { name: "Message utilisateur" })).toHaveTextContent(
      userMessage.content,
    );
  });

  it("renders an assistant message and its sources", () => {
    render(
      <MessageBubble
        message={{
          ...userMessage,
          id: "assistant-1",
          role: "assistant",
          content: "Voici une réponse simulée.",
          sources: [{ title: "Projets", url: "/projects", snippet: "Sélection de projets." }],
        }}
      />,
    );

    expect(screen.getByRole("article", { name: "Message assistant" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Projets" })).toHaveAttribute("href", "/projects");
  });
});
