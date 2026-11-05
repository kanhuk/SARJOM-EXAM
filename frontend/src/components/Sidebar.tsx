"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";



const mainNavigation = [
  { key: "dashboard", href: "/", icon: "⌂" },
  { key: "syllabus", href: "/syllabus", icon: "▥" },
  { key: "exams", href: "/exams", icon: "✓" },
  { key: "search", href: "/search", icon: "⌕" },
  { key: "saved", href: "/saved", icon: "♡" },
] as const;

export default function Sidebar() {
  const pathname = usePathname();


  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  function getLabel(key: (typeof mainNavigation)[number]["key"]) {
    switch (key) {
      case "dashboard": return "Home";
      case "syllabus": return "Syllabus";
      case "exams": return "Exams";
      case "search": return "Search";
      case "saved": return "Saved";
      default: return key;
    }
  }

  return (
    <aside className="hidden w-[250px] shrink-0 border-r border-[#dfe4ed] bg-white md:flex md:min-h-[calc(100vh-112px)] md:flex-col">

      <div className="flex-1 overflow-y-auto px-3 py-5">

        <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Main
        </div>

        <nav className="space-y-1">
          {mainNavigation.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-[#eef2ff] text-[#3568ff]"
                    : "text-slate-600 hover:bg-[#f5f7fb] hover:text-[#172238]"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base transition ${
                    active
                      ? "bg-[#3568ff] text-white shadow-sm"
                      : "bg-[#f1f3f7] text-slate-500 group-hover:bg-white"
                  }`}
                >
                  {item.icon}
                </span>

                <span>{getLabel(item.key)}</span>

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#3568ff]" />
                )}
              </Link>
            );
          })}
        </nav>

      </div>

    </aside>
  );
}




