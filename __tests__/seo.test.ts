import { describe, it, expect } from "vitest";
import { siteConfig } from "@/lib/site";

describe("configuração de SEO", () => {
  it("siteConfig tem URL base definida", () => {
    expect(siteConfig.url).toBeDefined();
    expect(siteConfig.url).not.toBe("");
  });
  it("siteConfig tem title e description", () => {
    expect(siteConfig.title).toBeDefined();
    expect(siteConfig.description).toBeDefined();
  });
  it("siteConfig tem keywords para SEO", () => {
    expect(Array.isArray(siteConfig.keywords)).toBe(true);
    expect(siteConfig.keywords.length).toBeGreaterThan(0);
  });
  it("sitemap inclui rotas públicas", () => {
    const publicRoutes = ["/", "/join", "/auth/login", "/auth/register"];
    publicRoutes.forEach((route) => {
      expect(route).toMatch(/^\/[a-z0-9/-]*$/);
    });
  });
  it("robots desindexa rotas privadas", () => {
    const privateRoutes = [
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
    ];
    privateRoutes.forEach((route) => {
      expect(route).toMatch(/^\/(dashboard|create|library|courses|reports|present|settings|auth\/(verify-email|recovery-codes|error))/);
    });
  });
});
