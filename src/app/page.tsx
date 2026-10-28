"use client";

import "./homepage-premium.css";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/language/LanguageProvider";
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
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  const router = useRouter();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>(initialNotices);

  useEffect(() => {
    let active = true;

    async function loadLiveNotices() {
      try {
        const types = ["exam", "admit-card", "answer-key", "result"] as const;
        const responses = await Promise.all(
          types.map(async (type) => {
            const res = await getContent(type);
            const records = Array.isArray(res.records) ? res.records : [];
            return records.slice(0, 2).map((r: any) => ({
              id: String(r.id),
              title: String(r.title || "Official Notification"),
              category: type,
              label: type === "admit-card" ? "ADMIT CARD" : type === "answer-key" ? "ANSWER KEY" : type === "result" ? "RESULT" : "NOTIFICATION",
              link: `/exams/${type}/${encodeURIComponent(r.id)}`,
              source: r.officialSource ? String(r.officialSource) : undefined,
            }));
          })
        );

        if (active) {
          const flat = responses.flat();
          if (flat.length > 0) {
            setTickerItems([...initialNotices, ...flat]);
          }
        }
      } catch {}
    }

    void loadLiveNotices();
    return () => { active = false; };
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(clean)}`);
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
      case "pyq": return "bg-[#00DDB0]/15 text-[#00DDB0] border border-[#00DDB0]/40";
      case "exam": return "bg-blue-500/15 text-blue-300 border border-blue-500/40";
      case "admit-card": return "bg-amber-400/15 text-amber-300 border border-amber-400/40";
      case "answer-key": return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40";
      case "result": return "bg-purple-500/15 text-purple-300 border border-purple-500/40";
      default: return "bg-slate-700/50 text-slate-300 border border-slate-600";
    }
  }

  const displayNotices = [...tickerItems, ...tickerItems];

  return (
    <div className="sarjom-viewport">
      <div className="sarjom-canvas">
        {/* LIVE NOTICES CONTINUOUS MARQUEE STRIP */}
        <div className="w-full rounded-2xl border border-slate-800 bg-[#0A0E17] shadow-lg mb-6 overflow-hidden flex items-center">
          <div className="bg-[#00DDB0] text-slate-950 font-mono text-[11px] font-black px-4 py-2.5 flex items-center gap-2 flex-shrink-0 z-10 uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-slate-950 animate-ping" />
            <span>LIVE NOTICES</span>
          </div>

          <div className="relative overflow-hidden w-full py-2.5 flex items-center group">
            <div className="flex items-center gap-8 whitespace-nowrap will-change-transform sarjom-marquee-active group-hover:[animation-play-state:paused]">
              {displayNotices.map((item, idx) => (
                item.link.startsWith("http") ? (
                  <a
                    key={`${item.id}-${idx}`}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 text-xs text-slate-200 hover:text-[#00DDB0] transition flex-shrink-0 font-medium"
                  >
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${getBadgeClass(item.category)}`}>
                      {item.label}
                    </span>
                    <span>{item.title}</span>
                    {item.source && (
                      <span className="text-[11px] text-slate-500 font-mono">[{item.source}]</span>
                    )}
                    <span className="text-slate-600">●</span>
                  </a>
                ) : (
                  <Link
                    key={`${item.id}-${idx}`}
                    href={item.link}
                    className="inline-flex items-center gap-2.5 text-xs text-slate-200 hover:text-[#00DDB0] transition flex-shrink-0 font-medium"
                  >
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${getBadgeClass(item.category)}`}>
                      {item.label}
                    </span>
                    <span>{item.title}</span>
                    {item.source && (
                      <span className="text-[11px] text-slate-500 font-mono">[{item.source}]</span>
                    )}
                    <span className="text-slate-600">●</span>
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>

        {/* HERO SECTION */}
        <header className="sarjom-hero-matrix">
          <span className="sarjom-kicker-sm">ACADEMIC PREPARATION WORKSPACE</span>
          
          <h1 className="sarjom-core-heading">
            <span className="sarjom-muted-line">TARGET YOUR EXAM</span>
            <span className="sarjom-electric-text">STRUCTURE YOUR PREPARATION</span>
          </h1>

          <p className="sarjom-descriptor">
            Verified official syllabus blueprints, real exam mode PYQs, and verified notifications for competitive examinations in one focused environment.
          </p>

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
                className="font-mono text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
            <button type="submit" className="sarjom-btn-single-search">
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

          {loading && (
            <div className="sarjom-telemetry-loader mt-5">
              <div className="sarjom-loader-pulse" />
              <span>Searching verified records...</span>
            </div>
          )}

          {result && (
            <div className="sarjom-console-drawer mt-5 w-full max-w-2xl text-left">
              <div className="sarjom-console-top">
                <div className="sarjom-console-brand">
                  <span className="sarjom-console-beacon" />
                  <span>SEARCH RESULT</span>
                </div>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="sarjom-console-close"
                >
                  Close ✕
                </button>
              </div>

              {result.found ? (
                <div className="sarjom-console-content">
                  <p>{result.answer || result.message}</p>
                </div>
              ) : (
                <div className="sarjom-not-found-box">
                  <div className="sarjom-not-found-icon">ℹ</div>
                  <div>
                    <h4>No exact matches found</h4>
                    <p>{result.message || "Try searching with an official exam name or syllabus topic."}</p>
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

          <div className="sarjom-bento-trio">
            {workspaces.map((ws) => (
              <Link key={ws.idx} href={ws.href} className="sarjom-bento-tile">
                <div className="sarjom-tile-top">
                  <div className="sarjom-icon-badge">
                    {ws.icon}
                  </div>
                  <span className="sarjom-tile-num">{ws.idx}</span>
                </div>
                <h3>{ws.title}</h3>
                <p>{ws.desc}</p>
                <div className="sarjom-tile-footer">
                  <span>{ws.action}</span>
                  <span className="sarjom-arrow">→</span>
                </div>
              </Link>
            ))}
          </div>
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

        {/* FOOTER */}
        <footer className="sarjom-terminal-footer">
          <div className="sarjom-foot-cluster">
            <span>© 2026 SARJOM EXAM. Academic Examination & Practice Portal.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

