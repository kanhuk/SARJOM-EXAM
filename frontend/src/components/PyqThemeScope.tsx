"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

function isPyqRoute(pathname: string): boolean {
  return (
    pathname === "/pyq" ||
    pathname.startsWith("/pyq/") ||
    pathname === "/pyq-practice" ||
    pathname.startsWith("/pyq-practice/")
  );
}

export default function PyqThemeScope() {
  const pathname = usePathname();
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    const onPyq = isPyqRoute(pathname);

    if (!onPyq) {
      root.classList.remove("dark");
      root.classList.add("light");
      root.style.colorScheme = "light";
      return;
    }

    const active = theme === "dark" || resolvedTheme === "dark" ? "dark" : "light";
    root.classList.remove("light", "dark");
    root.classList.add(active);
    root.style.colorScheme = active;
  }, [pathname, theme, resolvedTheme]);

  return null;
}