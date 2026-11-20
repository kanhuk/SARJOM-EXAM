"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: Theme;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
  resolvedTheme: "dark",
  themes: ["dark", "light"],
});

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "dark",
}: {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
}) {
  const initial: Theme = defaultTheme === "light" ? "light" : "dark";
  const [theme, setThemeState] = useState<Theme>(initial);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("sarjom-theme");
      if (saved === "light" || saved === "dark") {
        setThemeState(saved);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (attribute === "class") {
      root.classList.toggle("dark", theme === "dark");
      root.classList.toggle("light", theme === "light");
    }
    root.style.colorScheme = theme;
    try {
      window.localStorage.setItem("sarjom-theme", theme);
    } catch {
      // ignore storage errors
    }
  }, [theme, attribute]);

  const setTheme = (next: Theme) => setThemeState(next);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        resolvedTheme: theme,
        themes: ["dark", "light"],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}