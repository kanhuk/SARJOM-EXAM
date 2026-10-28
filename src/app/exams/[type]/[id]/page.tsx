"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getContent } from "@/lib/api";

const allowedTypes = [
  "exam",
  "admit-card",
  "answer-key",
  "result",
] as const;

type DetailRecord = {
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
  metadata?: Record<string, unknown>;
};

export default function ExamDetailPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const [record, setRecord] = useState<DetailRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const { type, id } = await params;

        if (!allowedTypes.includes(type as (typeof allowedTypes)[number])) {
          throw new Error("Unsupported examination content type.");
        }

        const response = await getContent(type, id);
        const found = response.records?.[0] as DetailRecord | undefined;

        if (!found) {
          throw new Error("This record could not be found in SARJOM.");
        }

        if (active) setRecord(found);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Unable to load this record.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [params]);

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/exams"
          className="inline-flex rounded-xl border border-[#d8dfeb] bg-white px-4 py-2 text-sm font-bold text-[#172238] hover:border-[#3568ff]"
        >
          ← Back to Exams
        </Link>

        <section className="mt-6 rounded-3xl border border-[#e2e7ef] bg-white p-6 shadow-sm sm:p-9">
          {loading ? (
            <p className="text-sm text-slate-500">Loading official record…</p>
          ) : error || !record ? (
            <div>
              <h1 className="text-2xl font-black text-[#172238]">
                Record unavailable
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {error || "The requested record could not be loaded."}
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs font-black uppercase tracking-widest text-[#3568ff]">
                SARJOM EXAM · {record.contentType}
              </p>

              <h1 className="mt-3 break-words text-3xl font-black tracking-tight text-[#172238] sm:text-4xl">
                {record.title}
              </h1>

              {record.description && (
                <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-600 sm:text-base">
                  {record.description}
                </p>
              )}

              <dl className="mt-7 grid gap-4 sm:grid-cols-2">
                {[
                  ["Status", record.status],
                  ["Official source", record.officialSource],
                  ["Published", record.publishedAt],
                  ["Last updated", record.updatedAt],
                  ["Last verified", record.lastVerifiedAt],
                ].filter((item) => item[1]).map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-[#f7f9fc] p-4">
                    <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      {label}
                    </dt>
                    <dd className="mt-2 break-words text-sm font-semibold text-[#172238]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              {record.metadata && Object.keys(record.metadata).length > 0 && (
                <section className="mt-7">
                  <h2 className="text-lg font-black text-[#172238]">
                    Additional information
                  </h2>
                  <dl className="mt-3 space-y-3">
                    {Object.entries(record.metadata).map(([key, value]) => (
                      <div key={key} className="rounded-xl border border-[#e2e7ef] p-4">
                        <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          {key.replace(/([A-Z])/g, " $1")}
                        </dt>
                        <dd className="mt-2 break-words text-sm leading-6 text-[#172238]">
                          {typeof value === "string" || typeof value === "number" || typeof value === "boolean"
                            ? String(value)
                            : value == null
                              ? "—"
                              : JSON.stringify(value, null, 2)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              {record.officialUrl && (
                <a
                  href={record.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex rounded-xl bg-[#3568ff] px-5 py-3 text-sm font-bold text-white hover:bg-[#2857e8]"
                >
                  Open official source ↗
                </a>
              )}

              <p className="mt-6 text-xs leading-5 text-slate-500">
                Record ID: {record.id}. Information is loaded from SARJOM’s
                existing content API.
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
