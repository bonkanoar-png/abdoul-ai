import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ConversationList } from "@/features/chat";

describe("ConversationList", () => {
  it("renders mock history and its non-storage notice", () => {
    render(<ConversationList />);

    expect(screen.getByRole("heading", { name: "Conversations" })).toBeInTheDocument();
    expect(screen.getByText("Parcours Data")).toBeInTheDocument();
    expect(screen.getByText(/non sauvegardé/)).toBeInTheDocument();
  });
});
