import type { Metadata } from "next";

export default function Page() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-background px-4 py-12 text-text-primary transition-colors">
      <article className="mx-auto max-w-3xl rounded-[18px] border border-border bg-surface p-7 shadow-sm sm:p-10">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
          OFFICIAL NOTICE
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
          Disclaimer
        </h1>
        <p className="mt-2 font-mono text-xs text-text-secondary">
          Effective Date: November 2026
        </p>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-text-secondary sm:text-base">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">1. No Government Affiliation</h2>
            <p>
              SARJOM EXAM is an independent educational preparation platform and is not affiliated with, endorsed by, or connected to any government department or recruiting commission.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">2. Verification With Official Notifications</h2>
            <p>
              While every effort is made to keep examination dates, syllabus structures, previous year papers, and answer keys accurate, candidates must always verify final schedules, eligibility rules, and official notices directly on the respective commission portals (such as UPSC, NTA, OPSC, OSSC, OSSSC, and OUSSSC).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">3. Study Aid Purpose</h2>
            <p>
              Practice explanations, accuracy metrics, and mock scores are designed solely as self-assessment study aids and do not guarantee examination outcomes.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Disclaimer",
    description: "Disclaimer on SARJOM EXAM.",
    openGraph: {
      title: "Disclaimer | SARJOM EXAM",
      description: "Disclaimer on SARJOM EXAM.",
      url: "https://www.sarjomexam.in/disclaimer",
    },
  };
}