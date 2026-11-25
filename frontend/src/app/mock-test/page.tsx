import Link from "next/link";

export default function MockTestPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          SARJOM EXAM TEST SERIES
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Mock Tests &amp; Practice Series
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">
          Start with free PYQ practice and demo tests, or explore full-length and subject-wise mock tests for OSSC, OPSC, Odisha Police, SSC, and Railway exams.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/pyq"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Start Free PYQ Practice
          </Link>
          <Link
            href="/exams"
            className="rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-text-primary transition hover:border-primary/60"
          >
            Browse Exams
          </Link>
        </div>
      </div>
    </main>
  );
}