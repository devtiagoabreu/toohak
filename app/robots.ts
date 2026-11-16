import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url;
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/join", "/auth/login", "/auth/register"],
        disallow: [
          "/api/",
          "/dashboard",
          "/create",
          "/library",
          "/courses",
          "/reports",
          "/present",
          "/settings",
          "/auth/verify-email",
          "/auth/recovery-codes",
          "/auth/error",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
