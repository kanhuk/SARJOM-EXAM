"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getContent } from "@/lib/api";
import { findSyllabusByParam } from "@/lib/syllabusSeo";
import type { ExamSyllabusRecord } from "@/data/examSyllabusCatalog";

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function SyllabusDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [record, setRecord] = useState<ExamSyllabusRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadSyllabus() {
      try {
        const { id } = await params;
        const catalogRecord = findSyllabusByParam(id) ?? null;

        if (catalogRecord && active) {
          setRecord(catalogRecord);
          setLoading(false);
        }

        const response = await getContent("syllabus", id);
        const remote = response.records?.[0] as Partial<ExamSyllabusRecord> | undefined;

        if (!active) return;

        if (remote && (remote.title || catalogRecord)) {
          setRecord((prev) => {
            const base = prev ?? catalogRecord;
            if (!base) return null;
            return {
              ...base,
              title: typeof remote.title === "string" && remote.title ? remote.title : base.title,
              description:
                typeof remote.description === "string" && remote.description
                  ? remote.description
                  : base.description,
              officialUrl:
                typeof remote.officialUrl === "string" && remote.officialUrl
                  ? remote.officialUrl
                  : base.officialUrl,
              updatedAt:
                typeof remote.updatedAt === "string" && remote.updatedAt
                  ? remote.updatedAt
                  : base.updatedAt,
            };
          });
          setError(null);
        } else if (!catalogRecord) {
          setError("The requested syllabus could not be found.");
        }
      } catch {
        if (active && !record) {
          setError("Unable to load syllabus details right now.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSyllabus();
    return () => {
      active = false;
    };
  }, [params]);

  if (loading && !record) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-sm text-slate-500">Loading syllabus blueprint...</p>
      </main>
    );
  }

  if (error || !record) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-xl font-bold text-slate-900">Syllabus Not Available</h1>
          <p className="mt-2 text-sm text-slate-600">
            {error || "The requested syllabus could not be found."}
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href="/syllabus"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Back to Syllabus Directory
            </Link>
            <Link
              href="/pyq"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Practice PYQs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const pyqHref = `/pyq?q=${encodeURIComponent(record.pyqTopicHint || record.title)}`;
  const detailHref = `/exams/details?id=${encodeURIComponent(record.metadata.examId || record.id)}`;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/syllabus"
          className="text-sm font-medium text-emerald-700 hover:underline"
        >
          ← All Exam Syllabi
        </Link>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={pyqHref}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            Practice PYQs
          </Link>
          <Link
            href={detailHref}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
          >
            Exam Blueprint
          </Link>
          {record.officialUrl && (
            <a
              href={record.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
            >
              Official Portal ↗
            </a>
          )}
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-700">
          <span className="rounded-full bg-emerald-50 px-3 py-1">{record.category}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            {record.conductingBody}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
            Updated: {formatDate(record.updatedAt)}
          </span>
        </div>

        <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
          {record.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {record.description}
        </p>

        {record.stages?.length > 0 && (
          <div className="mt-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Selection Stages
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {record.stages.map((stage) => (
                <span
                  key={stage}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-800"
                >
                  {stage}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="mt-6 space-y-5">
        {record.metadata.papers.map((paper, pIdx) => (
          <div
            key={`${paper.name}-${pIdx}`}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold text-slate-900">{paper.name}</h2>
            {paper.description && (
              <p className="mt-1 text-sm text-slate-600">{paper.description}</p>
            )}

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {paper.units.map((unit, uIdx) => (
                <div
                  key={`${unit.title}-${uIdx}`}
                  className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{unit.title}</h3>
                    {unit.weightage && (
                      <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                        {unit.weightage}
                      </span>
                    )}
                  </div>
                  <ul className="mt-2.5 space-y-1.5 text-xs text-slate-700">
                    {unit.topics.map((topic, tIdx) => (
                      <li key={`${topic}-${tIdx}`} className="flex items-start justify-between gap-2">
                        <span>• {topic}</span>
                        <Link
                          href={`/pyq?q=${encodeURIComponent(topic)}`}
                          className="shrink-0 font-semibold text-emerald-700 hover:underline"
                        >
                          Practice →
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}