"use client";

import { useTheme, type Theme } from "@/components/theme/theme-provider";

const nextTheme: Record<Theme, Theme> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const labels: Record<Theme, string> = {
  system: "Thème système",
  light: "Thème clair",
  dark: "Thème sombre",
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="border-line bg-surface text-foreground hover:bg-secondary inline-flex size-11 items-center justify-center rounded-full border text-base transition"
      type="button"
      onClick={() => setTheme(nextTheme[theme])}
      aria-label={`${labels[theme]}. Changer de thème`}
      title={labels[theme]}
    >
      <span aria-hidden="true">{theme === "dark" ? "☾" : theme === "light" ? "☀" : "◐"}</span>
    </button>
  );
}
