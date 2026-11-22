import type { Metadata } from "next";
import Link from "next/link";

const VERIFICATION_STEPS = [
  {
    step: "01",
    title: "Official Syllabus & Notification Mapping",
    detail:
      "Every syllabus outline and exam stage is aligned against published recruitment notifications and official board outlines rather than unverified third-party summaries.",
  },
  {
    step: "02",
    title: "Answer Key & PYQ Cross-Checking",
    detail:
      "Previous year questions are structured for timed CBT and tutor practice with clear marking schemes, topic tags, and an open error-reporting channel so discrepancies get flagged fast.",
  },
  {
    step: "03",
    title: "Odisha + National Exam Balance",
    detail:
      "Dedicated coverage for Odisha state recruitment alongside major national examinations, keeping navigation clean without forced login for basic practice.",
  },
];

export default function Page() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-background px-4 py-12 text-text-primary transition-colors">
      <div className="mx-auto max-w-4xl space-y-6">
        <article className="rounded-2xl border border-border bg-surface p-7 shadow-sm sm:p-10">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            ABOUT SARJOM EXAM
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Structured Competitive Exam Preparation Built on Official Sources
          </h1>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-text-secondary sm:text-base">
            <p>
              SARJOM EXAM is an exam preparation workspace focused on Odisha state examinations
              alongside key national competitive exams. Candidates can browse unit-wise syllabus
              structures, practice previous year papers in a computer-based test (CBT) interface,
              and track official exam updates without clutter.
            </p>
            <p>
              Instead of locking basic practice behind mandatory sign-ups or burying aspirants under
              distracting promotions, the platform prioritizes accuracy, transparent marking rules,
              and fast access to syllabus and PYQ workspaces.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/syllabus"
              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:opacity-95 sm:text-sm"
            >
              Explore Official Syllabus
            </Link>
            <Link
              href="/pyq"
              className="rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-text-primary transition hover:border-primary sm:text-sm"
            >
              Start PYQ Practice
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-text-primary transition hover:border-primary sm:text-sm"
            >
              Report a Correction
            </Link>
          </div>
        </article>

        <section
          aria-labelledby="verification-heading"
          className="rounded-2xl border border-border bg-surface p-7 shadow-sm sm:p-10"
        >
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            CONTENT STANDARDS &amp; CREDIBILITY
          </p>
          <h2
            id="verification-heading"
            className="mt-2 text-xl font-bold tracking-tight sm:text-2xl"
          >
            How Syllabus &amp; PYQ Content Is Maintained
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            Exam boards update patterns, notices, and provisional keys periodically. Our workflow
            focuses on source traceability and rapid candidate feedback:
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {VERIFICATION_STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-border bg-background p-4"
              >
                <span className="font-mono text-xs font-bold text-primary">
                  STEP {item.step}
                </span>
                <h3 className="mt-1.5 text-sm font-bold text-text-primary sm:text-base">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary sm:text-sm">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-border bg-background p-4 text-xs leading-relaxed text-text-secondary sm:text-sm">
            <strong className="text-text-primary">Source Transparency Note:</strong> SARJOM EXAM is an
            independent preparation resource and is not affiliated with UPSC, OPSC, OSSC, OSSSC,
            NTA, or any recruitment board. Always verify final dates, eligibility rules, and official
            cutoffs on the respective conducting authority&apos;s website.
          </div>
        </section>
      </div>
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const title = "About SARJOM EXAM | Odisha & National Exam Prep";
  const description =
    "Learn how SARJOM EXAM curates verified exam syllabi, CBT previous year papers, and recruitment updates for Odisha state and national competitive exams.";

  return {
    title: "About",
    description,
    alternates: {
      canonical: "/about",
    },
    openGraph: {
      title,
      description,
      url: "https://www.sarjomexam.in/about",
      siteName: "SARJOM EXAM",
      type: "website",
    },
  };
}
