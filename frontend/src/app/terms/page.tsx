export default function Page() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-background px-4 py-12 text-text-primary transition-colors">
      <article className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-7 shadow-sm sm:p-10">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
          LEGAL
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
          Terms of Service
        </h1>
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          <p>SARJOM EXAM is an educational preparation platform. Study materials, mock interfaces, and previous year question compilations are intended solely for personal academic use.</p>
          <p>Automated scraping, redistribution of question banks, or misuse of candidate accounts is prohibited.</p>
        </div>
      </article>
    </main>
  );
}