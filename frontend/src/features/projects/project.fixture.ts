import type { Project } from "@/features/projects/schemas/project.schema";

export const projectFixture = {
  id: "123e4567-e89b-42d3-a456-426614174001",
  profile_id: "123e4567-e89b-42d3-a456-426614174000",
  slug: "orange-nlp-itsm",
  title: "Orange NLP ITSM",
  description: "Classification automatique de tickets ITSM grâce au NLP.",
  short_description: "Automatiser le traitement des tickets ITSM.",
  content: "Une solution NLP mesurable, documentée et industrialisée.",
  github_url: "https://github.com/example/orange-nlp",
  demo_url: null,
  image_url: null,
  category: "AI",
  is_featured: true,
  sort_order: 1,
  created_at: "2026-07-01T10:00:00Z",
  updated_at: "2026-07-02T10:00:00Z",
  technologies: [
    {
      id: "123e4567-e89b-42d3-a456-426614174002",
      name: "Python",
      category: "Language",
      icon_url: null,
      sort_order: 1,
      created_at: "2026-07-01T10:00:00Z",
      updated_at: "2026-07-02T10:00:00Z",
    },
    {
      id: "123e4567-e89b-42d3-a456-426614174003",
      name: "BERT",
      category: "AI",
      icon_url: null,
      sort_order: 2,
      created_at: "2026-07-01T10:00:00Z",
      updated_at: "2026-07-02T10:00:00Z",
    },
  ],
} satisfies Project;
