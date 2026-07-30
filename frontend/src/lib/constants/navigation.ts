export const navigationItems = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/experience", label: "Expérience" },
  { href: "/skills", label: "Compétences" },
  { href: "/projects", label: "Projets" },
  { href: "/publications", label: "Publications" },
  { href: "/certifications", label: "Certifications" },
  { href: "/ai", label: "AI" },
  { href: "/contact", label: "Contact" },
] as const;

export type NavigationItem = (typeof navigationItems)[number];
