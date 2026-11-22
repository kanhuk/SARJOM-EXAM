"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/site-editing")) {
    return null;
  }

  return (
    <footer className="border-t border-border bg-surface/90 text-text-secondary transition-colors">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs sm:flex-row md:px-6">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <span>&copy; 2026 SARJOM <span className="font-semibold text-primary">EXAM</span>. All rights reserved.</span>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-5 font-medium">
          {footerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
