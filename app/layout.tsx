import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";
import "./design-system.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Toohak",
  description: "Plataforma de aprendizado gamificado e apresentações interativas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider defaultTheme="vibrant" switchable>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
