"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getContent } from "@/lib/api";

type Unit =
  | string
  | {
      title?: string;
      name?: string;
      topics?: string[];
    };

type Paper = {
  name?: string;
  description?: string;
  units?: Unit[];
};

type SyllabusRecord = {
  id: string;
  contentType: string;
  title: string;
  description?: string;
  officialUrl?: string;
  officialSource?: string;
  publishedAt?: string;
  updatedAt?: string;
  lastVerifiedAt?: string;
  status?: string;
  metadata?: {
    examName?: string;
    subject?: string;
    conductingBody?: string;
    papers?: Paper[];
  };
};

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

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
  const [record, setRecord] =
    useState<SyllabusRecord | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadSyllabus() {
      try {
        const { id } = await params;

        const response =
          await getContent("syllabus", id);

        const found =
          response.records?.[0] as
            | SyllabusRecord
            | undefined;

        if (!found) {
          setError(
            "The requested syllabus could not be found.",
          );
          return;
        }

        setRecord(found);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load syllabus.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadSyllabus();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f9fc] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto mb-4 max-w-6xl">
        <Link href="/pyq" className="inline-flex rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800">
          Go to PYQ Practice →
        </Link>
      </div>
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-[#e2e7ef] bg-white p-8 shadow-sm">
            <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
            <div className="mt-5 h-10 w-2/3 animate-pulse rounded bg-slate-100" />
            <div className="mt-4 h-5 w-1/2 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !record) {
    return (
      <main className="min-h-screen bg-[#f7f9fc] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-red-100 bg-white p-8 shadow-sm">
            <div className="text-sm font-bold text-red-500">
              SARJOM SYLLABUS
            </div>

            <h1 className="mt-3 text-3xl font-black text-[#172238]">
              Syllabus Not Found
            </h1>

            <p className="mt-3 text-slate-500">
              {error ||
                "The requested syllabus could not be loaded."}
            </p>

            <Link
              href="/syllabus"
              className="mt-6 inline-flex rounded-xl bg-[#3568ff] px-5 py-3 text-sm font-bold text-white"
            >
              ← Back to Syllabus
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const metadata = record.metadata;
  const papers = metadata?.papers ?? [];

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        <Link
          href="/syllabus"
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#3568ff] hover:underline"
        >
          ← Back to Syllabus
        </Link>

        <section className="overflow-hidden rounded-[30px] border border-[#e1e7f0] bg-white shadow-sm">

          <div className="bg-gradient-to-br from-[#172238] via-[#1d2e51] to-[#294b91] px-6 py-8 text-white sm:px-9 sm:py-10">

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em]">
                SARJOM SYLLABUS
              </span>

              {record.status && (
                <span className="rounded-full bg-emerald-400/15 px-3 py-1.5 text-[11px] font-bold text-emerald-200">
                  {record.status}
                </span>
              )}
            </div>

            <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              {record.title}
            </h1>

            {record.description && (
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                {record.description}
              </p>
            )}

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  Examination
                </div>

                <div className="mt-2 text-sm font-bold">
                  {metadata?.examName || "—"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  Subject
                </div>

                <div className="mt-2 text-sm font-bold">
                  {metadata?.subject || "—"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  Conducting Body
                </div>

                <div className="mt-2 text-sm font-bold">
                  {metadata?.conductingBody ||
                    record.officialSource ||
                    "—"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  Last Updated
                </div>

                <div className="mt-2 text-sm font-bold">
                  {formatDate(record.updatedAt)}
                </div>
              </div>

            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#e7ebf2] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">

            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                Official Source
              </div>

              <div className="mt-1 text-sm font-bold text-[#172238]">
                {record.officialSource ||
                  "Official Government Source"}
              </div>

              {record.lastVerifiedAt && (
                <div className="mt-1 text-xs text-slate-500">
                  Last verified{" "}
                  {formatDate(record.lastVerifiedAt)}
                </div>
              )}
            </div>

            {record.officialUrl && (
              <a
                href={record.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-[#3568ff] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2857e8]"
              >
                View Official Source ↗
              </a>
            )}

          </div>
        </section>

        <section className="mt-9">

          <div className="mb-5">
            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#3568ff]">
              Examination Structure
            </div>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-[#172238] sm:text-3xl">
              Papers & Units
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Explore the syllabus structure available in the SARJOM record.
            </p>
          </div>

          <div className="space-y-5">

            {papers.map((paper, paperIndex) => (
              <article
                key={`${paper.name || "paper"}-${paperIndex}`}
                className="overflow-hidden rounded-3xl border border-[#e1e7f0] bg-white shadow-sm"
              >

                <div className="border-b border-[#edf0f5] bg-[#fbfcfe] px-5 py-5 sm:px-7">

                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef2ff] text-sm font-black text-[#3568ff]">
                      {paperIndex + 1}
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-[#172238]">
                        {paper.name ||
                          `Paper ${paperIndex + 1}`}
                      </h3>

                      {paper.description && (
                        <p className="mt-1 text-sm text-slate-500">
                          {paper.description}
                        </p>
                      )}
                    </div>

                  </div>
                </div>

                {paper.units &&
                paper.units.length > 0 ? (
                  <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7">

                    {paper.units.map(
                      (unit, unitIndex) => {
                        const title =
                          typeof unit === "string"
                            ? unit
                            : unit.title ||
                              unit.name ||
                              `Unit ${unitIndex + 1}`;

                        const topics =
                          typeof unit === "string"
                            ? []
                            : unit.topics || [];

                        return (
                          <div
                            key={`${title}-${unitIndex}`}
                            className="rounded-2xl border border-[#e6ebf2] bg-white p-4 transition hover:border-[#cfd9ee] hover:shadow-sm"
                          >
                            <div className="flex items-start gap-3">

                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f1f3f7] text-xs font-black text-slate-500">
                                {unitIndex + 1}
                              </span>

                              <div className="min-w-0">
                                <h4 className="text-sm font-bold leading-5 text-[#172238]">
                                  {title}
                                </h4>

                                {topics.length > 0 && (
                                  <ul className="mt-2 space-y-1">
                                    {topics.map(
                                      (
                                        topic,
                                        topicIndex,
                                      ) => (
                                        <li
                                          key={`${topic}-${topicIndex}`}
                                          className="text-xs leading-5 text-slate-500"
                                        >
                                          • {topic}
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                )}
                              </div>

                            </div>
                          </div>
                        );
                      },
                    )}

                  </div>
                ) : (
                  <div className="px-7 py-6 text-sm text-slate-400">
                    No units are currently listed for this paper.
                  </div>
                )}

              </article>
            ))}

            {papers.length === 0 && (
              <div className="rounded-3xl border border-[#e1e7f0] bg-white p-8 text-center shadow-sm">
                <div className="text-3xl">📚</div>

                <h3 className="mt-3 font-bold text-[#172238]">
                  Syllabus structure not available
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Detailed paper and unit information has not yet been added.
                </p>
              </div>
            )}

          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-emerald-100 bg-emerald-50 p-5 sm:p-6">

          <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
              ✓
            </div>

            <div>
              <h3 className="text-sm font-black text-emerald-900">
                SARJOM Information Notice
              </h3>

              <p className="mt-1 text-xs leading-5 text-emerald-800">
                SARJOM presents this syllabus from its stored content
                record and associated official-source information.
                Always refer to the official source for the latest
                authoritative syllabus or examination update.
              </p>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}
