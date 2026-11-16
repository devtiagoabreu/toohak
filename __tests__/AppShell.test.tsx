import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AppShell from "@/components/AppShell";
import { ThemeProvider } from "@/components/ThemeProvider";

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { name: "Ágatha Maria Cano de Abreu", email: "agathamariachannel@gmail.com" } },
    status: "authenticated",
  }),
  signOut: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  usePathname: () => "/library",
  useRouter: () => ({ push: vi.fn() }),
}));

describe("AppShell", () => {
  it("exibe nome e iniciais do usuário autenticado", () => {
    render(
      <ThemeProvider defaultTheme="vibrant" switchable={false}>
        <AppShell><div>conteúdo</div></AppShell>
      </ThemeProvider>
    );
    expect(screen.getAllByText("Ágatha Maria Cano de Abreu").length).toBeGreaterThan(0);
    expect(screen.getAllByText("ÁA").length).toBeGreaterThan(0);
    expect(screen.queryByText("Ana Martins")).toBeNull();
  });
});
