import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();
  const routes = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/join", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/auth/login", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/auth/register", changeFrequency: "monthly" as const, priority: 0.7 },
  ];
  return routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
