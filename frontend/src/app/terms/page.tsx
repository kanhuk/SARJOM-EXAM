import type { Metadata } from "next";
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-background px-4 py-12 text-text-primary transition-colors">
      <article className="mx-auto max-w-3xl rounded-[18px] border border-border bg-surface p-7 shadow-sm sm:p-10">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
          LEGAL
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
          Terms of Service
        </h1>
        <p className="mt-2 font-mono text-xs text-text-secondary">
          Effective Date: November 2026
        </p>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-text-secondary sm:text-base">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">1. Personal Academic Use</h2>
            <p>
              SARJOM EXAM is an educational preparation platform. Syllabus trees, mock test consoles, explanations, and previous year question compilations are provided strictly for personal, non-commercial study by candidates.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">2. Fair Usage &amp; Content Protection</h2>
            <p>
              Automated scraping, bulk downloading, mirroring, or commercial redistribution of question banks, answer keys, or platform code is strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">3. Candidate Accounts &amp; Service Availability</h2>
            <p>
              Candidates are responsible for keeping their login credentials secure. While we strive for uninterrupted access, features or question sets may be updated, corrected, or temporarily paused for maintenance.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">4. Plans, Refunds &amp; Governing Law</h2>
            <p>
              Any future paid plans or test series will be governed by our{" "}
              <Link href="/refund" className="font-semibold text-primary underline underline-offset-4">
                Refund Policy
              </Link>
              . These terms are governed by the laws of India.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Terms of Service",
    description: "Terms of Service for SARJOM EXAM.",
    openGraph: {
      title: "Terms of Service | SARJOM EXAM",
      description: "Terms of Service for SARJOM EXAM.",
      url: "https://www.sarjomexam.in/terms",
    },
  };
}