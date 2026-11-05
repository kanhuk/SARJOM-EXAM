"use client";

import "@/app/homepage-premium.css";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
      <div className="sarjom-canvas">
        <header className="sarjom-hero-matrix">
          <div className="flex items-center justify-between">
            <span className="sarjom-kicker-sm">SARJOM SYLLABUS DIRECTORY</span>
            <Link
              href="/pyq"
              className="sarjom-speed-pill !border-[#00F299]/30 !bg-[#0f172a] !text-[#00F299] hover:!border-[#00F299]"
            >
              Go to PYQ Practice →
            </Link>
          </div>

          <h1 className="sarjom-core-heading mt-3">
            <span className="sarjom-muted-line">OFFICIAL SYLLABUS.</span>
            <span className="sarjom-electric-text">STRUCTURED CURRICULUM.</span>
          </h1>

          <p className="sarjom-descriptor">
            Explore topic breakdowns, exam stage details, and official subject structures for national and state competitive examinations.
          </p>

          <div className="sarjom-omni-bar mt-8">
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
                className="font-mono text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {!loading && (
            <p className="mt-4 font-mono text-xs text-slate-600">
              Showing {filteredRecords.length} syllabus record{filteredRecords.length === 1 ? "" : "s"} out of {records.length} available.
            </p>
          )}
        </header>

        {error && (
          <div role="alert" className="sarjom-not-found-box mt-6">
            <div className="sarjom-not-found-icon">⚠</div>
            <div>
              <h4>Notice</h4>
              <p>{error}</p>
            </div>
          </div>
        )}

        <section className="mt-12">
          <div className="sarjom-section-meta flex items-end justify-between">
            <div>
              <span className="sarjom-kicker-sm">EXAM SUBJECTS</span>
              <h2>Available Syllabus</h2>
              <p className="mt-1 text-sm font-medium text-slate-600">
                Detailed breakdowns verified from official notification documents.
              </p>
            </div>
            <span className="rounded-md border border-slate-300 bg-white/70 px-3 py-1 font-mono text-xs font-bold text-slate-700">
              {loading ? "..." : filteredRecords.length}
            </span>
          </div>

          {loading ? (
            <div className="sarjom-telemetry-loader">
              <div className="sarjom-loader-pulse" />
              <span>Loading syllabus records...</span>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="sarjom-roadmap-card !border-dashed mt-6">
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
                      <span className="sarjom-tile-tag">
                        {record.category || "SYLLABUS"}
                      </span>
                      <span className="sarjom-tile-num">
                        {record.stateCode ? record.stateCode.toUpperCase() : "ALL INDIA"}
                      </span>
                    </div>

                    <h3 className="line-clamp-2">{record.title}</h3>

                    {record.description && (
                      <p className="line-clamp-3 mt-3">{record.description}</p>
                    )}
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-4">
                    <Link
                      href={`/syllabus/${encodeURIComponent(record.id)}`}
                      className="flex items-center justify-between font-mono text-xs font-bold text-[#00F299] transition hover:text-[#00D8F6]"
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
      </div>
    </div>
  );
}
