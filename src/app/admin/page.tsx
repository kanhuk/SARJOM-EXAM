import Link from "next/link";

const groups = [
  { title: "Home Page Management", description: "Review homepage content and presentation settings.", href: "/admin/home-page", icon: "⌂" },
  { title: "Exams Management", description: "Review canonical exam records and publication status.", href: "/admin/exams", icon: "◎" },
  { title: "PYQ Management", description: "Work with question-paper content and verification requirements.", href: "/admin/pyqs", icon: "▤" },
  { title: "Reported Questions", description: "Student-reported question issues; reporting workflow needs integration.", href: "/admin/reported-questions", icon: "⚑" },
  { title: "Students Corner", description: "Candidate activity and test progress; data integration needs verification.", href: "/admin/students-corner", icon: "♙" },
  { title: "Syllabus Management", description: "Review syllabus records and topic organization.", href: "/admin/syllabus", icon: "▧" },
];

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#16804a]">Administrator workspace</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Admin Command</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Manage SARJOM-EXAM content areas from dedicated workspaces. Changes must use the canonical records and existing verification safeguards.
        </p>
      </section>

      <section className="rounded-2xl border border-[#dce8dd] bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#193326]">Workspace overview</p>
            <p className="mt-1 text-sm text-slate-600">Choose a management area to continue.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map((item) => (
            <Link key={item.href} href={item.href} className="group rounded-2xl border border-[#e0e8e0] bg-[#fcfdfb] p-5 transition hover:border-[#9fc9a8] hover:bg-white hover:shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf5ed] text-lg text-[#176b3c]">{item.icon}</span>
              <h2 className="mt-4 font-bold text-[#193326] group-hover:text-[#176b3c]">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              <p className="mt-4 text-sm font-bold text-[#176b3c]">Open workspace →</p>
            </Link>
          ))}
        </div>
      </section>
      <p className="text-xs leading-5 text-slate-500">Dashboard counts are intentionally omitted until their data sources are verified. This page does not change publication status.</p>
    </div>
  );
}

