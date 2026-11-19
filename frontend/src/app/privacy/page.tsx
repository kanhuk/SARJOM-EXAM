import type { Metadata } from "next";
export default function Page() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-background px-4 py-12 text-text-primary transition-colors">
      <article className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-7 shadow-sm sm:p-10">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
          LEGAL
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
          Privacy Policy
        </h1>
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          <p>We collect only essential account details (such as name, email address, and practice history) required to authenticate your candidate profile and save your exam progress.</p>
          <p>Your personal data is never sold to third parties. Authentication and session security are handled through encrypted Supabase infrastructure.</p>
        </div>
      </article>
    </main>
  );
}
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Privacy",
    description: "Privacy on SARJOM EXAM.",
    openGraph: {
      title: "Privacy | SARJOM EXAM",
      description: "Privacy on SARJOM EXAM.",
      url: "https://www.sarjomexam.in/privacy",
    },
  };
}