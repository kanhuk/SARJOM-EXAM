"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

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
          cache: "no-store"
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
        cache: "no-store"
      })
    ]);

    setUser(null);
    setIsAdmin(false);
    setMenuOpen(false);
    setMobileMenuOpen(false);
    router.replace("/");
    router.refresh();
  }

  const shortId = user?.id ? user.id.slice(0, 8).toUpperCase() : "";
  if (pathname.startsWith("/admin") || pathname.startsWith("/site-editing")) return null;

  return (
    <header className="w-full bg-[#0b0f17] border-b border-slate-800 text-slate-100 px-3 md:px-6 py-3.5 sticky top-0 z-50 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-6 md:gap-8">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link href="/" className="flex items-center m-0 p-0 hover:opacity-90 transition">
            <Image
              src="/logo 2.png"
              alt="SARJOM EXAM"
              width={190}
              height={50}
              className="object-contain h-10 md:h-12 w-auto mix-blend-screen brightness-125 contrast-110"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/" className="hover:text-emerald-400 transition">Home</Link>
            <Link href="/exams" className="hover:text-emerald-400 transition">Exams</Link>
            <Link href="/pyq" className="hover:text-emerald-400 transition">PYQ Practice</Link>
            <Link href="/syllabus" className="hover:text-emerald-400 transition">Syllabus</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {!checking && !user && (
            <Link href="/login" className="relative z-50 px-5 py-2 text-sm font-bold bg-[#b5e225] text-black rounded-lg hover:bg-[#a2ce18] transition cursor-pointer shadow-sm">
              Login
            </Link>
          )}

          {!checking && user && isAdmin && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(value => !value)}
                aria-expanded={menuOpen}
                aria-label="Admin account menu"
                className="px-4 md:px-5 py-2 text-sm font-bold bg-[#b5e225] text-black rounded-lg hover:bg-[#a2ce18] transition shadow-sm"
              >
                Admin <span aria-hidden="true">▾</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-slate-700 bg-[#151c2b] p-2 shadow-xl">
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
                  >
                    Admin Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={signOut}
                    disabled={signingOut}
                    className="mt-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-bold text-red-400 hover:bg-red-950 disabled:opacity-50"
                  >
                    {signingOut ? "Signing out…" : "Logout"}
                  </button>
                </div>
              )}
            </div>
          )}

          {!checking && user && !isAdmin && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(value => !value)}
                aria-expanded={menuOpen}
                aria-label="Candidate account menu"
                className="px-3 md:px-4 py-2 text-sm font-bold bg-[#b5e225] text-black rounded-lg hover:bg-[#a2ce18] transition shadow-sm"
              >
                ID: {shortId} <span aria-hidden="true">▾</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-slate-700 bg-[#151c2b] p-4 shadow-xl">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Candidate ID
                  </p>
                  <p className="mt-2 break-all text-sm font-mono text-white" title={user.id}>
                    {user.id}
                  </p>
                  <button
                    type="button"
                    onClick={signOut}
                    disabled={signingOut}
                    className="mt-4 w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {signingOut ? "Signing out…" : "Logout"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-3 text-sm font-medium text-slate-300 px-2">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg hover:bg-slate-800 hover:text-emerald-400 transition"
          >
            Home
          </Link>
          <Link 
            href="/exams" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg hover:bg-slate-800 hover:text-emerald-400 transition"
          >
            Exams
          </Link>
          <Link 
            href="/pyq" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg hover:bg-slate-800 hover:text-emerald-400 transition"
          >
            PYQ Practice
          </Link>
          <Link 
            href="/syllabus" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg hover:bg-slate-800 hover:text-emerald-400 transition"
          >
            Syllabus
          </Link>
        </nav>
      )}
    </header>
  );
}

export default Header;
