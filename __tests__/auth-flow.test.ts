import { describe, it, expect } from "vitest";

function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email) return { valid: false, error: "Email é obrigatório" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { valid: false, error: "Email inválido" };
  return { valid: true };
}

function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) return { valid: false, error: "Senha é obrigatória" };
  if (password.length < 6) return { valid: false, error: "Senha muito curta" };
  return { valid: true };
}

describe("fluxo de autenticação", () => {
  it("valida email obrigatório", () => {
    expect(validateEmail("").valid).toBe(false);
  });
  it("valida email inválido", () => {
    expect(validateEmail("nao-eum-email").valid).toBe(false);
  });
  it("aceita email válido", () => {
    expect(validateEmail("agatha@toohak.com").valid).toBe(true);
  });
  it("valida senha obrigatória", () => {
    expect(validatePassword("").valid).toBe(false);
  });
  it("valida senha curta", () => {
    expect(validatePassword("123").valid).toBe(false);
  });
  it("aceita senha válida", () => {
    expect(validatePassword("senha123").valid).toBe(true);
  });
});
