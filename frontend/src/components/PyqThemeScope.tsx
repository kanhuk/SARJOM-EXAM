"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

function isPyqRoute(pathname: string): boolean {
  return pathname === "/pyq" || pathname.startsWith("/pyq/");
}

export default function PyqThemeScope() {
  const pathname = usePathname();
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    const active = theme === "dark" || resolvedTheme === "dark" ? "dark" : "light";

    if (!isPyqRoute(pathname)) {
      root.classList.toggle("dark", active === "dark");
      root.classList.toggle("light", active === "light");
      root.style.colorScheme = active;
      return;
    }

    root.classList.remove("light", "dark");
    root.classList.add(active);
    root.style.colorScheme = active;
  }, [pathname, theme, resolvedTheme]);

  return null;
}
