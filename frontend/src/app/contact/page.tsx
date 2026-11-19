import type { Metadata } from "next";
export default function Page() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-background px-4 py-12 text-text-primary transition-colors">
      <article className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-7 shadow-sm sm:p-10">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
          CONTACT & SUPPORT
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
          Get in Touch
        </h1>
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          <p>For syllabus corrections, question paper reporting, or candidate account support, please reach out through our official support channel.</p>
          <p>Email: support@sarjomexam.in • Response window: Monday to Saturday, 10:00 AM – 6:00 PM IST.</p>
        </div>
      </article>
    </main>
  );
}
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact",
    description: "Contact on SARJOM EXAM.",
    openGraph: {
      title: "Contact | SARJOM EXAM",
      description: "Contact on SARJOM EXAM.",
      url: "https://www.sarjomexam.in/contact",
    },
  };
}