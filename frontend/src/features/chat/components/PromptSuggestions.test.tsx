import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PromptSuggestions } from "@/features/chat";

describe("PromptSuggestions", () => {
  it("returns the selected suggestion", () => {
    const onSelect = vi.fn();
    render(<PromptSuggestions onSelect={onSelect} />);

    fireEvent.click(screen.getByRole("button", { name: "Quels sont ses projets IA ?" }));

    expect(onSelect).toHaveBeenCalledWith("Quels sont ses projets IA ?");
  });
});
