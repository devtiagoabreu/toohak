"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeName = "vibrant" | "dracula" | "apple" | "ubuntu" | "windows" | "classic";

export interface ThemeOption {
  id: ThemeName;
  label: string;
  description: string;
  swatches: string[];
}

export const themeOptions: ThemeOption[] = [
  { id: "vibrant", label: "Vibrante", description: "Cores vivas para aprender brincando", swatches: ["#ff5c70", "#6c4cff", "#12b8a6"] },
  { id: "dracula", label: "Drácula", description: "Contraste noturno para código e foco", swatches: ["#bd93f9", "#ff79c6", "#50fa7b"] },
  { id: "apple", label: "Apple sóbrio", description: "Claro, calmo e minimalista", swatches: ["#0071e3", "#86868b", "#34c759"] },
  { id: "ubuntu", label: "Ubuntu", description: "Acolhedor, humano e comunitário", swatches: ["#e95420", "#77216f", "#19a3b7"] },
  { id: "windows", label: "Windows", description: "Azul, modular e produtivo", swatches: ["#0067c0", "#00a4ef", "#107c10"] },
  { id: "classic", label: "Clássico Toohak", description: "Editorial e acolhedor", swatches: ["#e96d5d", "#6954c8", "#5b9e8e"] },
];

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themeOptions: ThemeOption[];
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeName;
  switchable?: boolean;
}

export function ThemeProvider({ children, defaultTheme = "vibrant", switchable = true }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    if (!switchable || typeof window === "undefined") return defaultTheme;
    const stored = localStorage.getItem("toohak-theme") as ThemeName | null;
    return stored && themeOptions.some(option => option.id === stored) ? stored : defaultTheme;
  });

  const setTheme = (nextTheme: ThemeName) => setThemeState(nextTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle("dark", theme === "dracula");
    if (switchable) localStorage.setItem("toohak-theme", theme);
  }, [theme, switchable]);

  return <ThemeContext.Provider value={{ theme, setTheme, themeOptions, switchable }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
