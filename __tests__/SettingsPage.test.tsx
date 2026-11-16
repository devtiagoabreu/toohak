import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SettingsPage from "@/app/(app)/settings/page";

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { name: "Ágatha Maria Cano de Abreu", email: "agathamariachannel@gmail.com" } },
    status: "authenticated",
  }),
  signOut: vi.fn(),
}));

describe("SettingsPage", () => {
  it("exibe dados reais do perfil", () => {
    render(<SettingsPage />);
    expect(screen.getByText("Configurações")).toBeTruthy();
    expect(screen.getAllByText("Ágatha Maria Cano de Abreu").length).toBeGreaterThan(0);
    expect(screen.getAllByText("agathamariachannel@gmail.com").length).toBeGreaterThan(0);
    expect(screen.getByText("ÁA")).toBeTruthy();
  });
});
