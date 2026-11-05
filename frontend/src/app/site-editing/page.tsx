import Link from "next/link";

const tools = [
  { title: "Page Design", description: "Plan the supported page layout and visual hierarchy.", href: "/site-editing" },
  { title: "Text & Headings", description: "Manage editable text once connected to a persisted site configuration.", href: "/site-editing/text" },
  { title: "Colors & Theme", description: "Review the design-token editing workspace.", href: "/site-editing/theme" },
  { title: "Sections & Cards", description: "Review configurable homepage sections and cards.", href: "/site-editing/sections" },
  { title: "Navigation & Buttons", description: "Review navigation labels and button configuration.", href: "/site-editing/navigation" },
  { title: "Responsive Preview", description: "Inspect the responsive preview workspace.", href: "/site-editing/preview" },
  { title: "Version History", description: "Review version-history integration requirements.", href: "/site-editing/history" },
];

export default function SiteEditingPage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#16804a]">Website presentation</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Site Editing</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          A separate workspace for supported website presentation settings. The public homepage currently contains hardcoded content, so persistent editing, draft, preview, publishing and version history require a dedicated configuration workflow.
        </p>
      </section>
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
        <p className="font-bold text-amber-950">Editing is not yet connected to saved website configuration</p>
        <p className="mt-2 text-sm leading-6 text-amber-900">
          These pages establish navigation only. They do not claim to save, publish or restore content. The next implementation must add a validated, persistent configuration and revision workflow before enabling those actions.
        </p>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="rounded-2xl border border-[#dfe8df] bg-white p-5 transition hover:border-[#a9cfb1] hover:shadow-sm">
            <h2 className="font-bold">{tool.title} <span className="text-[#16804a]">→</span></h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
