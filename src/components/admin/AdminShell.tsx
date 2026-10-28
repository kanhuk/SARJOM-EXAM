"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/home-page", label: "Home Page Management", icon: "⌂" },
  { href: "/admin/exams", label: "Exams Management", icon: "◎" },
  { href: "/admin/pyqs", label: "PYQ Management", icon: "▤" },
  { href: "/admin/reported-questions", label: "Reported Questions", icon: "⚑" },
  { href: "/admin/students-corner", label: "Students Corner", icon: "♙" },
  { href: "/admin/syllabus", label: "Syllabus Management", icon: "▧" },
];

const editingLinks = [
  { href: "/site-editing", label: "Page Design", icon: "▦" },
  { href: "/site-editing/text", label: "Text & Headings", icon: "T" },
  { href: "/site-editing/theme", label: "Colors & Theme", icon: "◐" },
  { href: "/site-editing/sections", label: "Sections & Cards", icon: "▤" },
  { href: "/site-editing/navigation", label: "Navigation & Buttons", icon: "↗" },
  { href: "/site-editing/preview", label: "Responsive Preview", icon: "▣" },
  { href: "/site-editing/history", label: "Version History", icon: "↺" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isEditing = pathname.startsWith("/site-editing");
  const isLogin = pathname === "/admin/login";
  const links = isEditing ? editingLinks : adminLinks;

  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(!isLogin);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (isLogin) {
      setChecking(false);
      return;
    }

    let active = true;
    setChecking(true);

    fetch("/api/admin/session", {
      method: "GET",
      cache: "no-store",
      credentials: "same-origin",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Session check failed");
        return response.json();
      })
      .then((result) => {
        if (!active) return;
        if (result.authenticated === true) {
          setAuthenticated(true);
          setChecking(false);
        } else {
          router.replace("/admin/login");
        }
      })
      .catch(() => {
        if (active) router.replace("/admin/login");
      });

    return () => { active = false; };
  }, [pathname, isLogin, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSidebarOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sidebarOpen]);

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await fetch("/api/admin/session", {
        method: "DELETE",
        credentials: "same-origin",
        cache: "no-store",
      });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  if (isLogin) return <>{children}</>;

  if (checking || !authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f7f3] p-6 text-[#193326]">
        <div className="rounded-2xl border border-[#dce7dd] bg-white p-7 text-center shadow-sm">
          <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-[#d7e6da] border-t-[#167447]" />
          <p className="font-semibold">Checking secure admin session…</p>
          <p className="mt-1 text-sm text-slate-500">SARJOM EXAM Control Center</p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f3] text-[#193326]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 cursor-default bg-slate-950/40"
        />
      )}

      <aside
        id="sarjom-workspace-sidebar"
        aria-label={isEditing ? "Site Editing navigation" : "Admin Command navigation"}
        className={`fixed inset-y-0 left-0 z-50 flex w-[285px] max-w-[86vw] flex-col border-r border-[#dfe8df] bg-white shadow-2xl transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between border-b border-[#e7eee7] px-5 py-5">
          <div>
            <Link href="/admin" className="text-xl font-black tracking-tight">
              SARJOM <span className="text-[#16804a]">EXAM</span>
            </Link>
            <p className="mt-2 text-xs text-slate-500">Administration workspace</p>
          </div>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-slate-600 hover:bg-slate-50"
          >
            ✕
          </button>
        </div>


        <nav className="min-h-0 flex-1 space-y-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 pb-4 [scrollbar-width:auto] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-slate-50">
          <p className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">
            {isEditing ? "Website editor" : "Admin command"}
          </p>
          {links.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  active
                    ? "bg-[#eaf5ed] font-bold text-[#176b3c]"
                    : "font-medium text-slate-600 hover:bg-slate-50 hover:text-[#176b3c]"
                }`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#e7eee7] p-3">
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="w-full rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-[#dfe8df] bg-white/95 backdrop-blur">
        <div className="flex min-h-[76px] flex-wrap items-center gap-3 px-4 py-3 sm:px-7">
          <button
            type="button"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-controls="sarjom-workspace-sidebar"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((open) => !open)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#dce5dc] text-xl text-[#176b3c] transition hover:bg-[#edf6ef]"
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>


          <nav aria-label="Main workspaces" className="order-3 flex w-full items-center gap-2 sm:order-none sm:w-auto">
            <Link
              href="/admin"
              aria-current={!isEditing ? "page" : undefined}
              className={`flex-1 rounded-xl px-3 py-2.5 text-center text-sm font-bold transition sm:flex-none ${
                !isEditing ? "bg-[#176b3c] text-white shadow-sm" : "border border-[#dfe8df] bg-white text-slate-600 hover:bg-[#f0f7f1] hover:text-[#176b3c]"
              }`}
            >
              Admin Command
            </Link>
            <Link
              href="/site-editing"
              aria-current={isEditing ? "page" : undefined}
              className={`flex-1 rounded-xl px-3 py-2.5 text-center text-sm font-bold transition sm:flex-none ${
                isEditing ? "bg-[#176b3c] text-white shadow-sm" : "border border-[#dfe8df] bg-white text-slate-600 hover:bg-[#f0f7f1] hover:text-[#176b3c]"
              }`}
            >
              Site Editing
            </Link>
          </nav>

          <a
            href="/"
            className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-xl border border-[#dce5dc] bg-white px-3 py-2.5 text-xs font-bold text-[#176b3c] transition hover:bg-[#edf6ef] sm:ml-0 sm:text-sm"
          >
            <span className="hidden sm:inline">View Website</span>
            <span className="sm:hidden">Website</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1500px] p-4 sm:p-7 lg:p-9">
        {children}
      </main>
    </div>
  );
}


