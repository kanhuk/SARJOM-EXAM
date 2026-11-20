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
          Privacy Policy
        </h1>
        <p className="mt-2 font-mono text-xs text-text-secondary">
          Effective Date: November 2026
        </p>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-text-secondary sm:text-base">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">1. Information We Collect</h2>
            <p>
              We collect only essential candidate account details such as your name, email address, and exam preferences needed to authenticate your profile and sync your preparation progress.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">2. Practice Data &amp; Browser Storage</h2>
            <p>
              Bookmarks, mistake logs, quiz progress, and theme or language preferences may be stored locally in your browser storage as well as synced with your account so you can continue practice sessions smoothly across visits.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">3. How We Use Information</h2>
            <p>
              Your data is used strictly to operate CBT and Tutor practice consoles, generate accuracy insights, respond to reported question issues, and maintain account security. We never sell or rent personal data to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">4. Security &amp; Your Choices</h2>
            <p>
              Authentication and session records are protected through encrypted Supabase infrastructure. You can clear browser storage at any time or reach out through our{" "}
              <Link href="/contact" className="font-semibold text-primary underline underline-offset-4">
                Contact page
              </Link>{" "}
              to request updates or deletion of your candidate profile data.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Privacy Policy",
    description: "Privacy Policy for SARJOM EXAM.",
    openGraph: {
      title: "Privacy Policy | SARJOM EXAM",
      description: "Privacy Policy for SARJOM EXAM.",
      url: "https://www.sarjomexam.in/privacy",
    },
  };
}