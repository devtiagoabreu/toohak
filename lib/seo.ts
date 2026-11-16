import type { Metadata } from "next";

export function absoluteUrl(path = "/") {
  const base = (process.env.NEXT_PUBLIC_APP_URL || "https://toohak-jet.vercel.app").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
