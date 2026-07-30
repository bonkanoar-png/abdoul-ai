import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ChatWindow } from "@/features/chat";
import type { Message } from "@/features/chat/types/message";

const message = {
  id: "assistant-1",
  role: "assistant",
  content: "Bonjour, posez-moi une question.",
  createdAt: "2026-07-30T10:00:00Z",
} satisfies Message;

describe("ChatWindow", () => {
  it("renders messages passed to the conversation", () => {
    render(<ChatWindow initialMessages={[message]} />);

    expect(screen.getByText(message.content)).toBeInTheDocument();
    expect(screen.queryByText("Comment puis-je vous aider ?")).not.toBeInTheDocument();
  });

  it("renders its empty state and fills the input from a suggestion", () => {
    render(<ChatWindow />);

    expect(screen.getByText("Comment puis-je vous aider ?")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Présente-moi le parcours Data d'Abdoul" }));
    expect(screen.getByLabelText("Votre question")).toHaveValue(
      "Présente-moi le parcours Data d'Abdoul",
    );
  });

  it("simulates a user message and a local assistant response", () => {
    render(<ChatWindow />);

    fireEvent.change(screen.getByLabelText("Votre question"), {
      target: { value: "Quelles technologies maîtrise-t-il ?" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }));

    expect(screen.getByRole("article", { name: "Message utilisateur" })).toHaveTextContent(
      "Quelles technologies maîtrise-t-il ?",
    );
    expect(screen.getByRole("article", { name: "Message assistant" })).toHaveTextContent(
      "Réponse simulée",
    );
    expect(screen.getByLabelText("Votre question")).toHaveValue("");
  });
});
