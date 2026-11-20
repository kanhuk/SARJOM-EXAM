import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/auth/", "/site-editing"],
      },
    ],
    sitemap: "https://www.sarjomexam.in/sitemap.xml",
    host: "https://www.sarjomexam.in",
  };
}