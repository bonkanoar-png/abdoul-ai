export const designTokens = {
  colors: {
    background: "var(--background)",
    foreground: "var(--foreground)",
    primary: "var(--primary)",
    secondary: "var(--secondary)",
    muted: "var(--muted)",
    accent: "var(--accent)",
    danger: "var(--danger)",
    success: "var(--success)",
  },
  typography: {
    heading: "var(--font-heading)",
    body: "var(--font-body)",
    caption: "var(--font-caption)",
    code: "var(--font-code)",
  },
  spacing: {
    xs: "var(--space-xs)",
    sm: "var(--space-sm)",
    md: "var(--space-md)",
    lg: "var(--space-lg)",
    xl: "var(--space-xl)",
    "2xl": "var(--space-2xl)",
  },
  radius: {
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    full: "var(--radius-full)",
  },
} as const;
