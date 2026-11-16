import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Criar conta | Toohak",
  description: "Cadastre-se para começar a criar quizzes interativos e apresentações ao vivo.",
  alternates: { canonical: "/auth/register" },
  openGraph: {
    title: "Criar conta | Toohak",
    description: "Cadastre-se para começar a criar quizzes interativos e apresentações ao vivo.",
    url: "/auth/register",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
