"use client";

import "@/app/homepage-premium.css";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { getContent } from "@/lib/api";

type SyllabusRecord = {
  id: string;
  contentType: string;
  title: string;
  description?: string;
  stateCode?: string;
  category?: string;
  sourceUrl?: string;
  officialUrl?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

export default function SyllabusPage() {
  const prefersReducedMotion = useReducedMotion();
  const [records, setRecords] = useState<SyllabusRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSyllabus() {
      try {
        setLoading(true);
        setError("");

        const response = await getContent("syllabus");

        if (!cancelled) {
          setRecords(
            Array.isArray(response.records)
              ? (response.records as SyllabusRecord[])
              : [],
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load syllabus at this moment. Please try again shortly.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSyllabus();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return records;
    }

    return records.filter((record) =>
      [
        record.title,
        record.description,
        record.category,
        record.stateCode,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(normalized),
        ),
    );
  }, [records, query]);

  return (
    <div className="sarjom-viewport">
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
        className="sarjom-canvas"
      >
        <header className="sarjom-hero-matrix">
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <span className="sarjom-kicker-sm">SARJOM SYLLABUS DIRECTORY</span>
            <Link
              href="/pyq"
              className="rounded-xl bg-primary px-4 py-2 font-mono text-xs font-bold text-slate-950 shadow-sm transition hover:opacity-90"
            >
              Go to PYQ Practice →
            </Link>
          </div>

          <h1 className="sarjom-core-heading mt-4">
            <span className="sarjom-muted-line">OFFICIAL SYLLABUS.</span>
            <span className="sarjom-electric-text">
              STRUCTURED <span className="highlight-accent">CURRICULUM.</span>
            </span>
          </h1>

          <p className="sarjom-descriptor">
            Explore topic breakdowns, exam stage details, and official subject structures for national and state competitive examinations.
          </p>

          <div className="sarjom-omni-bar mt-7">
            <span className="sarjom-search-icon">⌕</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by exam name, paper, or subject..."
              className="sarjom-omni-field"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="font-mono text-xs text-text-secondary hover:text-text-primary"
              >
                Clear
              </button>
            )}
          </div>

          {!loading && (
            <p className="mt-4 font-mono text-xs text-text-secondary">
              Showing {filteredRecords.length} syllabus record{filteredRecords.length === 1 ? "" : "s"} out of {records.length} available.
            </p>
          )}
        </header>

        {error && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-2xl border border-warning/40 bg-warning/10 px-5 py-4 text-text-primary shadow-sm"
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-warning/20 text-sm font-bold text-warning">
              !
            </span>
            <div>
              <h4 className="text-sm font-bold text-text-primary">Notice</h4>
              <p className="mt-0.5 text-sm text-text-secondary">{error}</p>
            </div>
          </div>
        )}

        <section className="mt-10">
          <div className="sarjom-section-meta flex items-end justify-between gap-4">
            <div>
              <span className="sarjom-kicker-sm">EXAM SUBJECTS</span>
              <h2>Available Syllabus</h2>
              <p className="mt-1 text-sm font-medium text-text-secondary">
                Detailed breakdowns verified from official notification documents.
              </p>
            </div>
            <span className="rounded-xl border border-border bg-surface px-3.5 py-1.5 font-mono text-xs font-bold text-text-primary">
              {loading ? "..." : filteredRecords.length}
            </span>
          </div>

          {loading ? (
            <div className="mt-6 flex items-center gap-2 font-mono text-xs text-text-secondary">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
              <span>Loading syllabus records...</span>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="sarjom-roadmap-card mt-6">
              <h3>No syllabus found</h3>
              <p>
                {query
                  ? "No results matched your search. Try checking your spelling or search for another exam."
                  : "Syllabus records will be listed here as soon as they are published."}
              </p>
            </div>
          ) : (
            <div className="sarjom-bento-trio mt-6">
              {filteredRecords.map((record) => (
                <article
                  key={record.id}
                  className="sarjom-bento-tile justify-between"
                >
                  <div>
                    <div className="sarjom-tile-top">
                      <span className="rounded-md border border-primary/30 bg-primary/15 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                        {record.category || "SYLLABUS"}
                      </span>
                      <span className="sarjom-tile-num">
                        {record.stateCode ? record.stateCode.toUpperCase() : "ALL INDIA"}
                      </span>
                    </div>

                    <h3 className="line-clamp-2">{record.title}</h3>

                    {record.description && (
                      <p className="mt-3 line-clamp-3">{record.description}</p>
                    )}
                  </div>

                  <div className="mt-6 border-t border-slate-700/60 pt-4">
                    <Link
                      href={`/syllabus/${encodeURIComponent(record.id)}`}
                      className="flex items-center justify-between font-mono text-xs font-bold text-primary transition hover:opacity-85"
                    >
                      <span>VIEW SYLLABUS</span>
                      <span className="sarjom-arrow">→</span>
                    </Link>

                    {record.officialUrl && (
                      <a
                        href={record.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 block font-mono text-[11px] text-slate-400 hover:text-white"
                      >
                        Official Document ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </motion.div>
    </div>
  );
}