import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";

describe("theme", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("cycles through light, dark and system preferences", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Thème système/ }));
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(window.localStorage.getItem("abdoul-ai-theme")).toBe("light");

    fireEvent.click(screen.getByRole("button", { name: /Thème clair/ }));
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");

    fireEvent.click(screen.getByRole("button", { name: /Thème sombre/ }));
    expect(document.documentElement).not.toHaveAttribute("data-theme");
    expect(window.localStorage.getItem("abdoul-ai-theme")).toBeNull();
  });
});
