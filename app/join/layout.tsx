import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar em uma sessão ao vivo",
  description:
    "Participe de um quiz ou apresentação ao vivo no Toohak com o código da sessão.",
  alternates: { canonical: "/join" },
  openGraph: {
    title: "Entrar em uma sessão ao vivo | Toohak",
    description:
      "Participe de um quiz ou apresentação ao vivo no Toohak com o código da sessão.",
    url: "/join",
  },
};

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
