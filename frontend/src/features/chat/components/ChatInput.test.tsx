import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { ChatInput } from "@/features/chat";

function ControlledInput({ onSend }: { onSend: (message: string) => void }) {
  const [value, setValue] = useState("");
  return <ChatInput value={value} onChange={setValue} onSend={onSend} />;
}

describe("ChatInput", () => {
  it("disables submission for an empty message", () => {
    render(<ControlledInput onSend={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Envoyer" })).toBeDisabled();
    expect(screen.getByLabelText("Votre question")).toBeInTheDocument();
  });

  it("submits a trimmed local message", () => {
    const onSend = vi.fn();
    render(<ControlledInput onSend={onSend} />);

    fireEvent.change(screen.getByLabelText("Votre question"), {
      target: { value: "  Quels projets IA ?  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }));

    expect(onSend).toHaveBeenCalledWith("Quels projets IA ?");
  });
});
