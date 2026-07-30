import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

const publicRoutes = [
  "/",
  "/about",
  "/experience",
  "/skills",
  "/projects",
  "/publications",
  "/certifications",
  "/contact",
  "/ai",
  "/career-copilot",
  "/data-lab",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
