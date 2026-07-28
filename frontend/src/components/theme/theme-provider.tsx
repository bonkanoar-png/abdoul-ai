"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = "abdoul-ai-theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
  if (theme === "system") {
    document.documentElement.removeAttribute("data-theme");
    return;
  }
  document.documentElement.dataset.theme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    const initialTheme: Theme =
      storedTheme === "light" || storedTheme === "dark" ? storedTheme : "system";
    applyTheme(initialTheme);
    const updateState = window.setTimeout(() => setThemeState(initialTheme), 0);
    return () => window.clearTimeout(updateState);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme(nextTheme) {
        setThemeState(nextTheme);
        applyTheme(nextTheme);
        if (nextTheme === "system") {
          window.localStorage.removeItem(STORAGE_KEY);
        } else {
          window.localStorage.setItem(STORAGE_KEY, nextTheme);
        }
      },
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }
  return context;
}
