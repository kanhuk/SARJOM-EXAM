"use client";

import "./homepage-premium.css";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { getContent } from "@/lib/api";

type SearchResponse = {
  success?: boolean;
  found?: boolean;
  answer?: string;
  error?: string;
  message?: string;
};

type TickerItem = {
  id: string;
  title: string;
  category: "exam" | "admit-card" | "answer-key" | "result" | "deadline" | "pyq";
  label: string;
  link: string;
  source?: string;
};

const initialNotices: TickerItem[] = [
  { id: "notif-opsi-1", title: "Odisha Police SI 2023 Official Paper 1 and Paper 2 CBT Tests with Bilingual Explanations Live", category: "pyq", label: "NEW TEST LIVE", link: "/pyq?exam=Odisha+Police+SI" },
  { id: "ousssc-dir-1", title: "OUSSSC Official Directive: Police SI CPSE Candidate Profile Data Validation Active on ousssc.odisha.gov.in", category: "exam", label: "OFFICIAL DIRECTIVE", link: "https://ousssc.odisha.gov.in/", source: "OUSSSC" },
  { id: "notif-opsi-2", title: "Odisha Police SI 2022 Official CBT Mode with Timed Examination Interface Added to Portal", category: "pyq", label: "NEW TEST LIVE", link: "/pyq?exam=Odisha+Police+SI" },
  { id: "ousssc-cadre-1", title: "State Police Recruitment Board: 933 SI and 4219 Civil Constable Uniformed Cadre Finalized", category: "exam", label: "RECRUITMENT UPDATE", link: "https://ousssc.odisha.gov.in/", source: "OUSSSC" },
  { id: "notif-drill-1", title: "Odisha GK and History Special Sectional Practice Drills Enabled in CBT Console", category: "pyq", label: "SUBJECT DRILL", link: "/pyq?exam=Odisha+Police+SI" },
  { id: "nta-net-1", title: "UGC NET Paper 1 and Economics Paper 2 Official Practice Series Available", category: "pyq", label: "EXAM SERIES", link: "/pyq?exam=UGC+NET" },
  { id: "opsc-aso-1", title: "OPSC ASO General Awareness and Odia Language Question Bank Synced", category: "exam", label: "SYLLABUS UPDATE", link: "/syllabus" },
];

const popularCoreExams = [
  "Odisha Police SI",
  "UGC NET",
  "OPSC ASO",
  "UPSC CSE",
  "OSSC CGL",
];

const workspaces = [
  {
    idx: "01",
    title: "Exam Directory",
    desc: "Official notifications, eligibility standards, and examination calendar timelines across national and state bodies.",
    href: "/exams",
    action: "Explore exams",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    idx: "02",
    title: "Syllabus Explorer",
    desc: "Stage-wise topic breakdowns, official unit structures, and structured subject weightage trees.",
    href: "/syllabus",
    action: "Browse syllabus",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    idx: "03",
    title: "Study Center",
    desc: "Verified previous year question papers, timed examination modes, and instant answer evaluations.",
    href: "/pyq",
    action: "Start practice",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const plannedWorkspaces = [
  {
    status: "COMING SOON",
    statusClass: "status-planned",
    title: "Question Pattern Analytics",
    desc: "Historical unit weightage and recurring topic density across recent examination cycles.",
  },
  {
    status: "COMING SOON",
    statusClass: "status-dev",
    title: "Sectional Practice Tests",
    desc: "Unit-wise timed modules with real-time accuracy calculation and step-by-step explanations.",
  },
  {
    status: "COMING SOON",
    statusClass: "status-dev",
    title: "Structured Revision Queue",
    desc: "Automated schedule designed to systematically revise high-yield syllabus units before exam day.",
  },
];

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>(initialNotices);

  useEffect(() => {
    let active = true;

    async function loadLiveNotices() {
      try {
        const res = await fetch("/api/live-notices", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const rawList = Array.isArray(data?.notices) ? data.notices : [];

        const mapped: TickerItem[] = rawList.map((n: any, idx: number) => {
          const catText = String(n.category || "Notification");
          const upper = catText.toUpperCase();
          return {
            id: String(n.id || `live-${idx}`),
            title: String(n.title || "Official Notification"),
            category: catText,
            label: upper,
            link: String(n.link || "/exams"),
            source: n.source ? String(n.source) : undefined,
          };
        });

        if (active && mapped.length > 0) {
          setTickerItems(mapped);
        }
      } catch {}
    }

    void loadLiveNotices();
    return () => {
      active = false;
    };
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/live-notices");
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        found: false,
        message: "Search service is currently unavailable. Please try again shortly.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handlePillClick(val: string) {
    setQuery(val);
  }

  function getBadgeClass(cat: string) {
    switch (cat) {
      case "pyq":
        return "bg-primary/15 text-primary border border-primary/40";
      case "exam":
        return "bg-sky-500/15 text-sky-300 border border-sky-500/40";
      case "admit-card":
        return "bg-amber-400/15 text-amber-300 border border-amber-400/40";
      case "answer-key":
        return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40";
      case "result":
        return "bg-violet-500/15 text-violet-300 border border-violet-500/40";
      default:
        return "bg-slate-700/50 text-slate-200 border border-slate-600";
    }
  }

  const displayNotices = [...tickerItems, ...tickerItems];

  return (
    <div className="sarjom-viewport">
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.28 }}
        className="sarjom-canvas"
      >
        {/* LIVE NOTICES CONTINUOUS MARQUEE STRIP */}
        <div className="sarjom-live-rail mb-6">
          <div className="sarjom-live-label" aria-label="Notification">
            <span className="sarjom-live-pulse" />
            <span className="sarjom-live-word">Notification</span>
          </div>

          <div className="sarjom-live-window group" aria-label="Latest LIVE UPDATES">
            <div className="sarjom-live-track sarjom-marquee-active group-hover:[animation-play-state:paused]">
              {displayNotices.map((item, idx) =>
                item.link.startsWith("http") ? (
                  <a
                    key={`${item.id}-${idx}`} data-category={item.category || "Notification"}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-shrink-0 items-center gap-2.5 text-xs font-medium text-slate-200 transition hover:text-primary"
                  >
                    <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${getBadgeClass(item.category)}`}>
                      {item.label}
                    </span>
                    <span>{item.title}</span>
                    {item.source && (
                      <span className="font-mono text-[11px] text-slate-400">[{item.source}]</span>
                    )}
                    <span className="text-slate-600">●</span>
                  </a>
                ) : (
                  <Link
                    key={`${item.id}-${idx}`}
                    href={item.link}
                    className="inline-flex flex-shrink-0 items-center gap-2.5 text-xs font-medium text-slate-200 transition hover:text-primary"
                  >
                    <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${getBadgeClass(item.category)}`}>
                      {item.label}
                    </span>
                    <span>{item.title}</span>
                    {item.source && (
                      <span className="font-mono text-[11px] text-slate-400">[{item.source}]</span>
                    )}
                    <span className="text-slate-600">●</span>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>

        {/* HERO SECTION */}
        <header className="sarjom-hero-matrix">
          <span className="sarjom-kicker-sm">Odisha &amp; National Competitive Exams</span>

          <h1 className="sarjom-core-heading">
            <span className="sarjom-muted-line">Target Your Exam,</span>
            <span className="sarjom-electric-text">
              Structure Your <span className="highlight-accent">Preparation</span>
            </span>
          </h1>

          <p className="sarjom-descriptor">
            Verified official syllabus blueprints, timed CBT previous year papers, and timely recruitment updates in one calm, focused study workspace.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/pyq-practice"
              className="rounded-xl bg-[#10B981] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#059669]"
            >
              Start PYQ Practice
            </Link>
            <Link
              href="/syllabus"
              className="rounded-xl border border-border bg-surface/90 px-5 py-3 text-sm font-semibold text-text-primary transition hover:border-[#10B981] hover:text-[#059669]"
            >
              Explore Syllabus
            </Link>
          </div>

          <form onSubmit={handleSearch} className="sarjom-omni-bar">
            <span className="sarjom-search-icon">⌕</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search exam name, syllabus topic, or question paper..."
              className="sarjom-omni-field"
              aria-label="Search examinations and papers"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="font-mono text-xs text-text-secondary transition hover:text-text-primary"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="rounded-xl bg-[#10B981] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#059669]"
            >
              Search
            </button>
          </form>

          <div className="sarjom-quick-strip">
            <span className="sarjom-strip-head">POPULAR:</span>
            {popularCoreExams.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handlePillClick(item)}
                className="sarjom-speed-pill"
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">
              Priority Focus:
            </span>
            <Link
              href="/exams/details?id=ossc-cgl-specialist"
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-700 transition hover:bg-emerald-500/20 dark:text-emerald-300"
            >
              OSSC CGL Specialist Blueprint
            </Link>
            <Link
              href="/pyq?exam=UGC+NET"
              className="rounded-lg border border-border bg-surface px-3 py-1 font-semibold text-text-primary transition hover:border-primary"
            >
              UGC NET Dec 2026 PYQs
            </Link>
            <Link
              href="/syllabus/opsc-aso"
              className="rounded-lg border border-border bg-surface px-3 py-1 font-semibold text-text-primary transition hover:border-primary"
            >
              OPSC ASO Syllabus
            </Link>
          </div>

          {loading && (
            <div className="mt-5 flex items-center gap-2 font-mono text-xs text-text-secondary">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
              <span>Searching verified records...</span>
            </div>
          )}

          {result && (
            <div className="mt-5 w-full max-w-2xl rounded-2xl border border-border bg-surface p-4 text-left shadow-lg">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-primary">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span>SEARCH RESULT</span>
                </div>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="font-mono text-xs text-text-secondary hover:text-text-primary"
                >
                  Close ✕
                </button>
              </div>

              {result.found ? (
                <div className="mt-3 text-sm leading-relaxed text-text-primary">
                  <p>{result.answer || result.message}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`/pyq?q=${encodeURIComponent(query || "Odisha")}`}
                    className="rounded-lg bg-[#10B981] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#059669]"
                  >
                    Open PYQ Practice
                  </Link>
                  <Link
                    href="/syllabus"
                    className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-text-primary hover:border-primary"
                  >
                    Browse Syllabus
                  </Link>
                </div>
                </div>
              ) : (
                <div className="mt-3 flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 font-mono text-xs font-bold text-primary">
                    i
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary">No exact matches found</h4>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      {result.message || "Try searching with an official exam name or syllabus topic."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </header>

        {/* ACTIVE WORKSPACES */}
        <section className="mt-8">
          <div className="sarjom-section-meta">
            <span className="sarjom-kicker-sm">START PREPARING</span>
            <h2>Active Workspaces</h2>
          </div>

          <motion.div
            initial={prefersReducedMotion ? "visible" : "hidden"}
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: prefersReducedMotion ? 0 : 0.07,
                },
              },
            }}
            className="sarjom-bento-trio"
          >
            {workspaces.map((ws) => (
              <motion.div
                key={ws.idx}
                variants={{
                  hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0, transition: { duration: prefersReducedMotion ? 0 : 0.25 } },
                }}
              >
                <Link href={ws.href} className="sarjom-bento-tile h-full">
                  <div className="sarjom-tile-top">
                    <div className="sarjom-icon-badge">{ws.icon}</div>
                    <span className="sarjom-tile-num">{ws.idx}</span>
                  </div>
                  <h3>{ws.title}</h3>
                  <p>{ws.desc}</p>
                  <div className="sarjom-tile-footer">
                    <span>{ws.action}</span>
                    <span className="sarjom-arrow">→</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ROADMAP SECTION */}
        <section className="mt-12">
          <div className="sarjom-section-meta">
            <span className="sarjom-kicker-sm">THE ROAD AHEAD</span>
            <h2>Upcoming Modules</h2>
          </div>

          <div className="sarjom-roadmap-grid">
            {plannedWorkspaces.map((item) => (
              <div key={item.title} className="sarjom-roadmap-card">
                <span className={`sarjom-status-pill ${item.statusClass}`}>
                  {item.status}
                </span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
}