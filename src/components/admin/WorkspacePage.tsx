import Link from "next/link";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  status: string;
  nextStep: string;
  links?: { label: string; href: string; description: string }[];
};

export default function WorkspacePage({
  eyebrow, title, description, status, nextStep, links = [],
}: Props) {
  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#16804a]">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-[#193326] sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
      </div>

      <section className="rounded-2xl border border-[#dfe8df] bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Workspace status</h2>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">{status}</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{nextStep}</p>
        <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
          No content has been changed or published from this page. Existing verification rules remain in effect.
        </p>
      </section>

      {links.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-bold">Related workspaces</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-2xl border border-[#dfe8df] bg-white p-5 transition hover:border-[#a9cfb1] hover:shadow-sm">
                <h3 className="font-bold text-[#193326]">{link.label} <span className="text-[#16804a]">→</span></h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{link.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
