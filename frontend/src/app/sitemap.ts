import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { listExams } from "@/lib/sarjom-core/exams";

export const dynamic = "force-dynamic";

const BASE_URL = "https://www.sarjomexam.in";

const STATIC_ROUTES = [
  "",
  "/exams",
  "/syllabus",
  "/pyq",
  "/pyq-practice",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
];

function toSlug(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function collectDynamicExamPaths(): Promise<Array<{ path: string; lastModified: Date }>> {
  const found = new Map<string, Date>();

  const registerItem = (item: Record<string, unknown>) => {
    const rawSlug =
      toSlug(item.slug) ||
      toSlug(item.exam_slug) ||
      toSlug(item.title) ||
      toSlug(item.name);
    const rawId = typeof item.id === "string" || typeof item.id === "number" ? String(item.id).trim() : "";

    const updatedRaw = item.updated_at ?? item.updatedAt ?? item.created_at;
    const modDate =
      typeof updatedRaw === "string" && !Number.isNaN(Date.parse(updatedRaw))
        ? new Date(updatedRaw)
        : new Date();

    if (rawSlug) {
      found.set(`/exams/${encodeURIComponent(rawSlug)}`, modDate);
    }
    if (rawId && rawId !== rawSlug) {
      found.set(`/exams/exam/${encodeURIComponent(rawId)}`, modDate);
    }
  };

  try {
    const localExams = await listExams();
    if (Array.isArray(localExams)) {
      for (const ex of localExams) {
        if (ex && typeof ex === "object") {
          registerItem(ex as Record<string, unknown>);
        }
      }
    }
  } catch {
    // Ignore local exam helper errors during sitemap generation
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: examRows } = await supabase.from("exams").select("*");
      if (Array.isArray(examRows)) {
        for (const row of examRows) {
          if (row && typeof row === "object") {
            registerItem(row as Record<string, unknown>);
          }
        }
      }

      const { data: contentRows } = await supabase
        .from("content")
        .select("*")
        .eq("content_type", "exam");
      if (Array.isArray(contentRows)) {
        for (const row of contentRows) {
          if (row && typeof row === "object") {
            registerItem(row as Record<string, unknown>);
          }
        }
      }
    } catch {
      // Fall back gracefully to static + local exam entries
    }
  }

  return Array.from(found.entries()).map(([path, lastModified]) => ({
    path,
    lastModified,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/pyq" || route === "/exams" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/exams" || route === "/pyq" ? 0.9 : 0.8,
  }));

  const dynamicExams = await collectDynamicExamPaths();
  const dynamicEntries: MetadataRoute.Sitemap = dynamicExams.map(({ path, lastModified }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  return [...staticEntries, ...dynamicEntries];
}