import { createServer } from "node:http";

const timestamp = "2026-07-01T10:00:00Z";
const profileId = "123e4567-e89b-42d3-a456-426614174000";
const projectId = "123e4567-e89b-42d3-a456-426614174001";
const technologyId = "123e4567-e89b-42d3-a456-426614174002";

const fixtures = {
  "/api/v1/profile": {
    id: profileId,
    name: "Abdoul",
    title: "Data Scientist & AI Engineer",
    bio: "Je conçois des produits Data et IA robustes.",
    location: "France",
    email: "abdoul@example.com",
    github_url: "https://github.com/abdoul",
    linkedin_url: null,
    avatar_url: null,
    created_at: timestamp,
    updated_at: timestamp,
  },
  "/api/v1/experiences": [
    {
      id: "123e4567-e89b-42d3-a456-426614174003",
      profile_id: profileId,
      company: "Orange SA",
      role: "Data Analyst NLP / IA",
      description: "Analyse et industrialisation de solutions NLP.",
      start_date: "2024-01-01",
      end_date: null,
      is_current: true,
      sort_order: 1,
      created_at: timestamp,
      updated_at: timestamp,
    },
  ],
  "/api/v1/skills": [
    {
      id: "123e4567-e89b-42d3-a456-426614174004",
      name: "Python",
      category: "Backend Engineering",
      sort_order: 1,
      created_at: timestamp,
      updated_at: timestamp,
    },
  ],
  "/api/v1/projects": [
    {
      id: projectId,
      profile_id: profileId,
      slug: "orange-nlp-itsm",
      title: "Orange NLP ITSM",
      description: "Classification automatique de tickets ITSM grâce au NLP.",
      content: "Une solution NLP documentée et industrialisée.",
      github_url: "https://github.com/example/orange-nlp",
      demo_url: null,
      image_url: null,
      is_featured: true,
      sort_order: 1,
      created_at: timestamp,
      updated_at: timestamp,
      category: "AI",
      short_description: "Automatiser le traitement des tickets ITSM.",
      technologies: [
        {
          id: technologyId,
          name: "Python",
          category: "Language",
          icon_url: null,
          sort_order: 1,
          created_at: timestamp,
          updated_at: timestamp,
        },
      ],
    },
  ],
  "/api/v1/publications": [],
  "/api/v1/certifications": [],
};

const server = createServer((request, response) => {
  const path = request.url?.split("?")[0] ?? "/";

  if (path === "/health") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (path in fixtures) {
    response.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify(fixtures[path]));
    return;
  }

  response.writeHead(404, { "Content-Type": "application/json" });
  response.end(
    JSON.stringify({ error: { code: "NOT_FOUND", message: "Not found", details: null } }),
  );
});

server.listen(4010, "127.0.0.1");

function closeServer() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", closeServer);
process.on("SIGTERM", closeServer);
