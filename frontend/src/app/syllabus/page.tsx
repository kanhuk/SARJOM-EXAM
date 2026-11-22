"use client";

import "@/app/homepage-premium.css";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getContent } from "@/lib/api";
import {
  ALL_EXAM_SYLLABI,
  type ExamSyllabusRecord,
  type SyllabusPaper,
} from "@/data/examSyllabusCatalog";

function normalizeRecord(raw: Record<string, unknown>, fallbackIndex: number): ExamSyllabusRecord {
  const id = String(raw.id || raw.slug || `syllabus-${fallbackIndex}`);
  const catalogMatch = ALL_EXAM_SYLLABI.find(
    (c) => c.id === id || c.title.toLowerCase() === String(raw.title || "").toLowerCase(),
  );

  const rawMeta =
    raw.metadata && typeof raw.metadata === "object"
      ? (raw.metadata as Record<string, unknown>)
      : undefined;

  const papers: SyllabusPaper[] = Array.isArray(rawMeta?.papers)
    ? (rawMeta.papers as SyllabusPaper[])
    : catalogMatch?.metadata.papers ?? [
        {
          name: "Core Syllabus",
          description: String(raw.description || catalogMatch?.description || ""),
          units: [
            {
              title: String(rawMeta?.subject || raw.category || "General Syllabus"),
              topics: ["Core Concepts", "Key Chapters"],
            },
          ],
        },
      ];

  return {
    id,
    slug: String(raw.slug || catalogMatch?.slug || id),
    contentType: "syllabus",
    title: String(raw.title || catalogMatch?.title || "Syllabus"),
    description: String(raw.description || catalogMatch?.description || ""),
    category: String(raw.category || catalogMatch?.category || "General"),
    stateCode: String(raw.stateCode || raw.state_code || catalogMatch?.stateCode || "ALL INDIA"),
    conductingBody: String(
      raw.conductingBody || rawMeta?.conductingBody || catalogMatch?.conductingBody || "Official Board",
    ),
    qualification: typeof raw.qualification === "string" ? raw.qualification : catalogMatch?.qualification,
    officialUrl:
      typeof raw.officialUrl === "string"
        ? raw.officialUrl
        : typeof raw.official_url === "string"
          ? raw.official_url
          : catalogMatch?.officialUrl,
    updatedAt: String(raw.updatedAt || raw.updated_at || catalogMatch?.updatedAt || "2026-11-01"),
    stages: Array.isArray(raw.stages) ? (raw.stages as string[]) : catalogMatch?.stages ?? [],
    highYieldFocus: [],
    pyqTopicHint:
      typeof raw.pyqTopicHint === "string"
        ? raw.pyqTopicHint
        : catalogMatch?.pyqTopicHint || String(raw.title || ""),
    pattern: [],
    metadata: {
      examId: String(rawMeta?.examId || catalogMatch?.metadata.examId || id),
      examName: String(rawMeta?.examName || catalogMatch?.metadata.examName || raw.title || "Exam"),
      subject: String(rawMeta?.subject || catalogMatch?.metadata.subject || "General Studies"),
      conductingBody: String(
        rawMeta?.conductingBody || catalogMatch?.conductingBody || "Official Board",
      ),
      papers,
    },
  };
}

export default function SyllabusPage() {
  const [records, setRecords] = useState<ExamSyllabusRecord[]>(ALL_EXAM_SYLLABI);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedExamId, setSelectedExamId] = useState<string>(ALL_EXAM_SYLLABI[0]?.id || "");

  useEffect(() => {
    let cancelled = false;

    async function loadSyllabus() {
      try {
        const response = await getContent("syllabus");
        if (!cancelled && Array.isArray(response.records) && response.records.length > 0) {
          const normalized = response.records.map((r, idx) =>
            normalizeRecord(r as Record<string, unknown>, idx),
          );
          const mergedMap = new Map<string, ExamSyllabusRecord>();
          for (const item of ALL_EXAM_SYLLABI) {
            mergedMap.set(item.id, item);
          }
          for (const item of normalized) {
            mergedMap.set(item.id, {
              ...(mergedMap.get(item.id) || item),
              ...item,
              metadata: {
                ...(mergedMap.get(item.id)?.metadata || item.metadata),
                ...item.metadata,
              },
            });
          }
          setRecords(Array.from(mergedMap.values()));
        }
      } catch {
        // Keep catalog records
      }
    }

    loadSyllabus();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const r of records) {
      if (r.category) set.add(r.category);
    }
    return ["ALL", ...Array.from(set)];
  }, [records]);

  const filteredRecords = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((item) => {
      if (selectedCategory !== "ALL" && item.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      const inTitle = item.title.toLowerCase().includes(q);
      const inBody = item.conductingBody.toLowerCase().includes(q);
      const inCat = item.category.toLowerCase().includes(q);
      const inPapers = item.metadata.papers.some(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.units.some(
            (u) =>
              u.title.toLowerCase().includes(q) ||
              u.topics.some((t) => t.toLowerCase().includes(q)),
          ),
      );
      return inTitle || inBody || inCat || inPapers;
    });
  }, [records, query, selectedCategory]);

  useEffect(() => {
    if (filteredRecords.length === 0) return;
    const stillExists = filteredRecords.some((item) => item.id === selectedExamId);
    if (!stillExists) {
      setSelectedExamId(filteredRecords[0].id);
    }
  }, [filteredRecords, selectedExamId]);

  const activeExam = useMemo(() => {
    if (filteredRecords.length === 0) return null;
    return filteredRecords.find((item) => item.id === selectedExamId) || filteredRecords[0];
  }, [filteredRecords, selectedExamId]);

  return (
    <div className="sarjom-viewport">
      <div className="sarjom-canvas">
        <header className="border-b border-border pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-text-secondary uppercase">
                SARJOM SYLLABUS DIRECTORY
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                Official Syllabus &amp; Curriculum
              </h1>
              <p className="mt-1 text-sm text-text-secondary">
                Showing {filteredRecords.length} of {records.length} syllabus records.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/pyq"
                className="rounded-md border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-text-primary transition hover:border-text-primary"
              >
                PYQ Practice -&gt;
              </Link>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-text-primary bg-text-primary text-surface"
                        : "border-border bg-surface text-text-secondary hover:border-text-primary hover:text-text-primary"
                    }`}
                  >
                    {cat === "ALL" ? "All Exams" : cat}
                  </button>
                );
              })}
            </div>

            <div className="w-full sm:w-72">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter exam or topic..."
                className="w-full rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text-primary placeholder:text-text-secondary focus:border-text-primary focus:outline-none"
              />
            </div>
          </div>
        </header>

        <section className="mt-6">
          {filteredRecords.length === 0 || !activeExam ? (
            <div className="rounded-lg border border-border bg-surface p-8 text-center">
              <h2 className="text-base font-semibold text-text-primary">No syllabus found</h2>
              <p className="mt-1 text-sm text-text-secondary">
                Try clearing your search filter or switching to another exam category.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-12">
              <aside className="lg:col-span-4">
                <div className="rounded-lg border border-border bg-surface p-3">
                  <div className="mb-2 flex items-center justify-between px-2 py-1 text-xs font-semibold text-text-secondary">
                    <span>EXAMS ({filteredRecords.length})</span>
                    <span>{selectedCategory === "ALL" ? "ALL" : selectedCategory}</span>
                  </div>
                  <div className="max-h-[72vh] space-y-1.5 overflow-y-auto pr-1">
                    {filteredRecords.map((item) => {
                      const isSelected = item.id === activeExam.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedExamId(item.id)}
                          className={`w-full rounded-md border px-3 py-2.5 text-left transition ${
                            isSelected
                              ? "border-text-primary bg-text-primary text-surface"
                              : "border-border bg-surface text-text-primary hover:border-text-primary"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 text-[11px] opacity-80">
                            <span className="font-semibold">{item.category}</span>
                            <span>{item.stateCode}</span>
                          </div>
                          <div className="mt-1 text-xs font-semibold leading-snug">
                            {item.title}
                          </div>
                          <div className="mt-0.5 truncate text-[11px] opacity-75">
                            {item.conductingBody}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </aside>

              <div className="lg:col-span-8">
                <article className="rounded-lg border border-border bg-surface p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                        <span className="font-semibold text-text-primary">{activeExam.category}</span>
                        <span>•</span>
                        <span>{activeExam.stateCode}</span>
                        <span>•</span>
                        <span>{activeExam.conductingBody}</span>
                      </div>
                      <h2 className="mt-1.5 text-xl font-bold text-text-primary sm:text-2xl">
                        {activeExam.title}
                      </h2>
                      <p className="mt-1.5 text-sm text-text-secondary">
                        {activeExam.description}
                      </p>
                    </div>

                    <Link
                      href={`/syllabus/${activeExam.slug || activeExam.id}`}
                      className="rounded-md border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-text-primary transition hover:border-text-primary"
                    >
                      Full Syllabus Page -&gt;
                    </Link>
                  </div>

                  {activeExam.qualification && (
                    <div className="mt-4 rounded-md border border-border px-3.5 py-2.5 text-xs text-text-secondary">
                      <span className="font-semibold text-text-primary">Eligibility: </span>
                      {activeExam.qualification}
                    </div>
                  )}

                  {activeExam.stages && activeExam.stages.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
                        Selection Stages
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {activeExam.stages.map((stage) => (
                          <span
                            key={stage}
                            className="rounded-md border border-border px-2.5 py-1 text-xs text-text-primary"
                          >
                            {stage}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 space-y-5">
                    {activeExam.metadata.papers.map((paper, pIdx) => (
                      <div
                        key={`${paper.name}-${pIdx}`}
                        className="rounded-md border border-border p-4"
                      >
                        <h3 className="text-sm font-bold text-text-primary">{paper.name}</h3>
                        {paper.description && (
                          <p className="mt-1 text-xs text-text-secondary">
                            {paper.description}
                          </p>
                        )}
                        <div className="mt-3 space-y-3">
                          {paper.units.map((unit, uIdx) => (
                            <div key={`${unit.title}-${uIdx}`}>
                              <div className="text-xs font-semibold text-text-primary">
                                {unit.title}
                              </div>
                              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-xs text-text-secondary">
                                {unit.topics.map((topic, tIdx) => (
                                  <li key={`${tIdx}-${topic.slice(0, 20)}`}>{topic}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
