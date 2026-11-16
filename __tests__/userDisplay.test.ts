import { describe, it, expect } from "vitest";
import { getDisplayName, getInitials } from "@/lib/userDisplay";

describe("userDisplay", () => {
  it("retorna o nome quando presente", () => {
    expect(getDisplayName({ name: "Ágatha Maria Cano de Abreu", email: "a@b.com" })).toBe("Ágatha Maria Cano de Abreu");
  });
  it("usa a parte local do email como fallback", () => {
    expect(getDisplayName({ name: "", email: "agathamariachannel@gmail.com" })).toBe("agathamariachannel");
  });
  it("usa Usuário como fallback", () => {
    expect(getDisplayName(null)).toBe("Usuário");
  });
  it("calcula iniciais do nome completo", () => {
    expect(getInitials({ name: "Ágatha Maria Cano de Abreu", email: "x@y.com" })).toBe("ÁA");
  });
  it("calcula iniciais de nome simples", () => {
    expect(getInitials({ name: "Agatha", email: "x@y.com" })).toBe("AG");
  });
  it("calcula iniciais a partir do email", () => {
    expect(getInitials({ name: "", email: "agatha@example.com" })).toBe("AG");
  });
});
