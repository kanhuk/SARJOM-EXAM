"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, ChevronDown, LogOut, ShieldCheck, User as UserIcon } from "lucide-react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/exams", label: "Exams" },
  { href: "/pyq", label: "PYQ Practice" },
  { href: "/syllabus", label: "Syllabus" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let active = true;

    async function resolveAccount(session: Session | null) {
      if (!session?.user) {
        if (active) {
          setUser(null);
          setIsAdmin(false);
          setChecking(false);
          setMenuOpen(false);
        }
        return;
      }

      if (active) {
        setUser(session.user);
        setChecking(true);
      }

      let admin = false;

      try {
        const response = await fetch("/api/admin/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: session.access_token }),
          cache: "no-store",
        });

        admin = response.ok;
      } catch {
        // Keep the authenticated account visible if the admin check is temporarily unavailable.
      }

      if (active) {
        setIsAdmin(admin);
        setChecking(false);
      }
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        void resolveAccount(session);
      }
    );

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setChecking(false);
        return;
      }
      void resolveAccount(data.session);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);

    await Promise.allSettled([
      supabase.auth.signOut(),
      fetch("/api/admin/session", {
        method: "DELETE",
        credentials: "same-origin",
        cache: "no-store",
      }),
    ]);

    setUser(null);
    setIsAdmin(false);
    setMenuOpen(false);
    setMobileMenuOpen(false);
    router.replace("/");
    router.refresh();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/site-editing")) return null;

  const shortId = user?.id ? user.id.slice(0, 8).toUpperCase() : "";
  const initials =
    user?.email?.[0]?.toUpperCase() ||
    user?.user_metadata?.full_name?.[0]?.toUpperCase() ||
    (isAdmin ? "A" : "S");

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className={`sticky top-2.5 z-50 mx-auto rounded-2xl border px-2 text-text-primary transition-all duration-300 ease-out sm:px-3 ${scrolled ? "w-[calc(100%-1rem)] max-w-4xl border-border/75 bg-surface/90 shadow-sm backdrop-blur-xl" : "w-[calc(100%-1.5rem)] max-w-6xl border-border/60 bg-surface/80 backdrop-blur-md sm:w-[calc(100%-3rem)] md:w-[calc(100%-6rem)]"}`}>
      <div className={`mx-auto grid items-center gap-3 transition-all duration-300 ease-out md:px-4 ${scrolled ? "max-w-4xl grid-cols-[auto_1fr_auto] px-2.5 py-1" : "max-w-6xl grid-cols-[auto_1fr_auto] px-3 py-2"}`}>
        <div className="flex items-center gap-2 justify-self-start">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border/70 bg-surface/80 text-text-primary transition hover:border-primary/60 hover:text-primary md:hidden"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <Link href="/" className="group flex items-center gap-2.5 rounded-full pr-1 transition hover:opacity-95"><Image src="/logo-rounded.png" alt="SARJOM EXAM" width={64} height={64} className={`${scrolled ? "h-8 w-8 md:h-9 md:w-9" : "h-11 w-11 md:h-14 md:w-14"} rounded-full object-contain transition-all duration-200 ease-out`} priority /><span className="flex flex-col items-center leading-none"><span className={`whitespace-nowrap font-serif font-semibold uppercase tracking-[0.04em] text-text-primary transition-all duration-200 ease-out ${scrolled ? "text-xs md:text-[14px]" : "text-sm md:text-[18px]"}`}>SARJOM</span><span className={`whitespace-nowrap font-sans font-semibold uppercase text-primary transition-all duration-200 ease-out ${scrolled ? "mt-0.5 text-[7px] tracking-[0.28em] md:text-[8px]" : "mt-1 text-[8px] tracking-[0.34em] md:text-[9px]"}`}>EXAM</span></span></Link>
        </div>

        <nav
          className="hidden items-center justify-center gap-5 md:flex lg:gap-7"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => {
            const active = isActiveLink(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 text-[13px] font-medium tracking-tight transition-colors duration-150 ${
                  active
                    ? "font-semibold text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <span>{item.label}</span>
                {active && (
                  <span className="absolute inset-x-0 -bottom-0.5 h-[1.5px] rounded-full bg-text-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-self-end gap-2">
          <ThemeToggle />

          {!checking && !user && (
            <Link
              href="/login"
              className="rounded-full bg-gradient-to-r from-[#090d0b] via-[#0d3b27] to-[#0f764b] px-4 py-1.5 text-xs font-semibold text-white shadow-[0_6px_20px_-4px_rgba(15,118,75,0.45)] transition-all duration-200 hover:brightness-110 active:scale-[0.98] sm:px-4"
            >
              Login
            </Link>
          )}

          {!checking && user && isAdmin && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                aria-expanded={menuOpen}
                aria-label="Admin account menu"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-primary transition hover:border-primary/60"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 font-mono text-[11px] font-bold text-white dark:bg-white dark:text-slate-950">
                  {initials}
                </span>
                <span className="hidden sm:inline">Admin</span>
                <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
                    className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-border bg-surface p-2 shadow-xl"
                  >
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-text-primary transition hover:bg-background"
                    >
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <span>Admin Dashboard</span>
                    </Link>
                    <button
                      type="button"
                      onClick={signOut}
                      disabled={signingOut}
                      className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-danger transition hover:bg-danger/10 disabled:opacity-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{signingOut ? "Signing out…" : "Logout"}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {!checking && user && !isAdmin && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                aria-expanded={menuOpen}
                aria-label="Candidate account menu"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-primary transition hover:border-primary/60"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 font-mono text-[11px] font-bold text-white dark:bg-white dark:text-slate-950">
                  {initials}
                </span>
                <span className="font-mono text-xs">ID: {shortId}</span>
                <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
                    className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-border bg-surface p-4 shadow-xl"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      <UserIcon className="h-3.5 w-3.5 text-primary" />
                      <span>Candidate ID</span>
                    </div>
                    <p
                      className="mt-2 break-all rounded-lg border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-text-primary"
                      title={user.id}
                    >
                      {user.id}
                    </p>
                    <button
                      type="button"
                      onClick={signOut}
                      disabled={signingOut}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-danger px-4 py-2 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{signingOut ? "Signing out…" : "Logout"}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
            aria-label="Mobile navigation"
            className="overflow-hidden rounded-b-2xl border-t border-border bg-surface/95 px-4 pb-4 pt-3 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = isActiveLink(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-background font-semibold text-text-primary"
                        : "text-text-secondary hover:bg-background/60 hover:text-text-primary"
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-text-primary" />}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
