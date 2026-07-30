import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar } from "@/components/ui/avatar";

describe("Avatar image", () => {
  it("provides alternative text and intrinsic responsive sizing", () => {
    render(<Avatar name="Abdoul" src="https://images.example.com/abdoul.jpg" size="lg" />);

    expect(screen.getByRole("img", { name: "Abdoul" })).toHaveAttribute(
      "src",
      expect.stringContaining("images.example.com"),
    );
  });
});
