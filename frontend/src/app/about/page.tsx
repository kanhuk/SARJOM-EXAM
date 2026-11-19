export default function Page() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-background px-4 py-12 text-text-primary transition-colors">
      <article className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-7 shadow-sm sm:p-10">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
          ABOUT SARJOM EXAM
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
          Structured Competitive Exam Preparation
        </h1>
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          <p>SARJOM EXAM provides candidates with verified official syllabus structures, previous year question papers in CBT practice mode, and timely recruitment updates across national and Odisha state examinations.</p>
          <p>Every module is designed for distraction-free study, transparent marking schemes, and reliable reference material.</p>
        </div>
      </article>
    </main>
  );
}