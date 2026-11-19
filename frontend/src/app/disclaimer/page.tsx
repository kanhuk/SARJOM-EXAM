import type { Metadata } from "next";
export default function Page() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-background px-4 py-12 text-text-primary transition-colors">
      <article className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-7 shadow-sm sm:p-10">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
          OFFICIAL NOTICE
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
          Disclaimer
        </h1>
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          <p>While every effort is made to keep examination notifications, syllabus trees, and answer keys accurate, candidates must always verify final dates, eligibility criteria, and official PDFs on the respective recruiting commission websites (such as UPSC, NTA, OPSC, OSSC, OSSSC, and OUSSSC).</p>
          <p>SARJOM EXAM is an independent academic platform and is not affiliated with any government recruitment body.</p>
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