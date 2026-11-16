import { describe, it, expect } from "vitest";

function getLuminance(r: number, g: number, b: number): number {
  const sRGB = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

function contrastRatio(color1: string, color2: string): number {
  const hexToRgb = (hex: string) => {
    let h = hex.replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const bigint = parseInt(h, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);
  const lum1 = getLuminance(r1, g1, b1);
  const lum2 = getLuminance(r2, g2, b2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("contraste de cores (WCAG AA - 4.5:1 para texto normal)", () => {
  it("Drácula: texto branco sobre fundo dracula passa no contraste", () => {
    const ratio = contrastRatio("#f8f8f2", "#282a36");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("Drácula: texto curso-intro sobre fundo dracula passa no contraste", () => {
    const ratio = contrastRatio("#f8f8f2", "#1e1f29");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("Vibrante: texto branco sobre fundo escuro passa no contraste", () => {
    const ratio = contrastRatio("#fff", "#20242b");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("Botão secundário hover: texto ink sobre fundo mix escuro passa no contraste", () => {
    const ratio = contrastRatio("#20242b", "#f8f9fa");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("Texto enfatizado Drácula (coral) sobre fundo escuro passa no contraste", () => {
    const ratio = contrastRatio("#ff79c6", "#1e1f29");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
