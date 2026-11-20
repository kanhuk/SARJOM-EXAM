import type { MetadataRoute } from "next";
import { ALL_EXAM_SYLLABI } from "@/data/examSyllabusCatalog";

const BASE_URL = "https://www.sarjomexam.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-11-20T00:00:00.000Z");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/syllabus`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pyq-practice`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/exams`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const seenSlugs = new Set<string>();
  const syllabusRoutes: MetadataRoute.Sitemap = [];

  for (const item of ALL_EXAM_SYLLABI) {
    const slug = (item.slug || item.id).trim();
    if (!slug || seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const parsedDate = new Date(item.updatedAt || "2026-11-20");
    syllabusRoutes.push({
      url: `${BASE_URL}/syllabus/${encodeURIComponent(slug)}`,
      lastModified: Number.isNaN(parsedDate.getTime()) ? now : parsedDate,
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  return [...staticRoutes, ...syllabusRoutes];
}