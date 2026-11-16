import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Entrar | Toohak",
  description: "Faça login na sua conta Toohak e comece a criar quizzes interativos.",
  alternates: { canonical: "/auth/login" },
  openGraph: {
    title: "Entrar | Toohak",
    description: "Faça login na sua conta Toohak e comece a criar quizzes interativos.",
    url: "/auth/login",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
