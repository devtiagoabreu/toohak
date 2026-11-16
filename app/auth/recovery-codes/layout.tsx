import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Códigos de recuperação | Toohak",
  robots: { index: false, follow: false },
};

export default function RecoveryCodesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
