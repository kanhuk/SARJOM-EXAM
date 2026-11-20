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

  const shortId = user?.id ? user.id.slice(0, 8).toUpperCase() : "";
  const initials =
    user?.email?.[0]?.toUpperCase() ||
    user?.user_metadata?.full_name?.[0]?.toUpperCase() ||
    (isAdmin ? "A" : "S");

  if (pathname.startsWith("/admin") || pathname.startsWith("/site-editing")) return null;

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b text-text-primary transition-all duration-200 ${
        scrolled
          ? "border-border/80 bg-surface/80 shadow-sm backdrop-blur-xl"
          : "border-border bg-surface/95 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        <div className="flex items-center gap-4 md:gap-8">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/80 text-text-primary transition hover:border-primary/60 hover:text-primary md:hidden"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="flex items-center rounded-lg p-0.5 transition hover:opacity-90">
            <Image
              src="/logo 2.png"
              alt="SARJOM EXAM"
              width={190}
              height={50}
              className="h-9 w-auto object-contain md:h-10 dark:mix-blend-screen dark:brightness-125 dark:contrast-110"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-1.5 rounded-2xl border border-border/60 bg-background/60 p-1 md:flex"
            aria-label="Primary navigation"
          >
            {navItems.map((item) => {
              const active = isActiveLink(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 ${
                    active
                      ? "bg-primary/15 text-primary shadow-2xs"
                      : "text-text-secondary hover:bg-surface hover:text-text-primary"
                  }`}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="absolute inset-x-3.5 bottom-1 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <ThemeToggle />

          {!checking && !user && (
            <Link
              href="/login"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark sm:px-5"
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
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/85 px-3 py-1.5 text-sm font-bold text-text-primary shadow-sm transition hover:border-primary/60"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-mono text-xs font-black text-white">
                  {initials}
                </span>
                <span className="hidden sm:inline">Admin</span>
                <ChevronDown className="h-4 w-4 text-text-secondary" />
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
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-text-primary transition hover:bg-background"
                    >
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <span>Admin Dashboard</span>
                    </Link>
                    <button
                      type="button"
                      onClick={signOut}
                      disabled={signingOut}
                      className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-danger transition hover:bg-danger/10 disabled:opacity-50"
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
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/85 px-2.5 py-1.5 text-sm font-bold text-text-primary shadow-sm transition hover:border-primary/60 sm:px-3.5"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-mono text-xs font-black text-white">
                  {initials}
                </span>
                <span className="font-mono text-xs sm:text-sm">ID: {shortId}</span>
                <ChevronDown className="h-4 w-4 text-text-secondary" />
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
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-danger px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
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

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
            aria-label="Mobile navigation"
            className="overflow-hidden border-t border-border bg-surface/95 px-4 pb-4 pt-3 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1.5 rounded-2xl border border-border/60 bg-background/60 p-2">
              {navItems.map((item) => {
                const active = isActiveLink(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-primary/15 text-primary"
                        : "text-text-secondary hover:bg-surface hover:text-text-primary"
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && <span className="h-2 w-2 rounded-full bg-primary" />}
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