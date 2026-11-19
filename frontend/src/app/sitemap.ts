import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.sarjomexam.in";
  const routes = ["", "/exams", "/syllabus", "/pyq", "/pyq-practice", "/about", "/contact", "/privacy", "/terms", "/disclaimer"];
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/pyq" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
