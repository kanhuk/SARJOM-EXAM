"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Exam = {
  id: string; title: string; description?: string; officialUrl?: string;
  officialSource?: string; stateCode?: string; status?: string;
  updatedAt?: string; metadata?: Record<string, unknown>;
};
type FormState = {
  id?: string; title: string; name: string; description: string;
  officialUrl: string; officialSource: string; stateCode: string; reason: string;
  conductingBody: string; qualification: string; totalMarks: string;
  stages: string; pattern: string; markDistribution: string; cutoffs: string;
  verificationStatus: string; lastVerifiedAt: string;
};
const emptyForm: FormState = {
  title: "", name: "", description: "", officialUrl: "", officialSource: "",
  stateCode: "", reason: "", conductingBody: "", qualification: "",
  totalMarks: "", stages: "[]",
  pattern: '[\n  {"paper":"Paper 1","subject":"General Studies","questions":100,"marks":100,"duration":"120 minutes","negative":"As per official notification"}\n]',
  markDistribution: '[\n  {"section":"Section name","marks":"20","keyTopics":"Important topics"}\n]',
  cutoffs: '[\n  {"year":"2025","category":"UR","marks":"—","notes":"Add only sourced values"}\n]',
  verificationStatus: "unverified", lastVerifiedAt: ""
};

function jsonText(value: unknown, fallback: string) {
  return JSON.stringify(value ?? JSON.parse(fallback), null, 2);
}
function asText(value: unknown) { return typeof value === "string" ? value : ""; }

export default function ExamsManagementPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadExams = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/exams", {
        credentials: "same-origin", cache: "no-store"
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error(result.error || "Could not load exams.");
      setExams(Array.isArray(result.exams) ? result.exams : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load exams.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void loadExams(); }, [loadExams]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return !term ? exams : exams.filter((exam) =>
      [exam.title, exam.description, exam.officialSource, exam.stateCode, exam.status]
        .some((v) => typeof v === "string" && v.toLowerCase().includes(term)));
  }, [exams, query]);

  function beginCreate() {
    setForm(emptyForm); setEditing(false); setShowForm(true); setError(""); setNotice("");
  }

  function beginEdit(exam: Exam) {
    if (exam.status !== "draft") return;
    const meta = exam.metadata ?? {};
    const bp = meta.blueprint && typeof meta.blueprint === "object"
      ? meta.blueprint as Record<string, unknown> : {};
    const verification = bp.verification && typeof bp.verification === "object"
      ? bp.verification as Record<string, unknown> : {};
    setForm({
      ...emptyForm, id: exam.id, title: exam.title ?? "",
      name: asText(meta.name) || exam.title, description: exam.description ?? "",
      officialUrl: exam.officialUrl ?? "", officialSource: exam.officialSource ?? "",
      stateCode: exam.stateCode ?? "", reason: "",
      conductingBody: asText(bp.conductingBody), qualification: asText(bp.qualification),
      totalMarks: bp.totalMarks == null ? "" : String(bp.totalMarks),
      stages: jsonText(bp.stages, "[]"),
      pattern: jsonText(bp.pattern, "[]"),
      markDistribution: jsonText(bp.markDistribution, "[]"),
      cutoffs: jsonText(bp.cutoffs, "[]"),
      verificationStatus: asText(verification.status) || "unverified",
      lastVerifiedAt: asText(verification.lastVerifiedAt)
    });
    setEditing(true); setShowForm(true); setError(""); setNotice("");
  }

  function parseArray(value: string, label: string) {
    let parsed: unknown;
    try { parsed = JSON.parse(value); }
    catch { throw new Error(`${label} must contain valid JSON.`); }
    if (!Array.isArray(parsed)) throw new Error(`${label} must be a JSON array.`);
    return parsed;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      const pattern = parseArray(form.pattern, "Exam pattern");
      const markDistribution = parseArray(form.markDistribution, "Syllabus / weightage");
      const stages = parseArray(form.stages, "Selection stages");
      const cutoffs = parseArray(form.cutoffs, "Cutoff archive");
      const totalMarks = form.totalMarks.trim() ? Number(form.totalMarks) : undefined;
      if (totalMarks !== undefined && (!Number.isFinite(totalMarks) || totalMarks < 0))
        throw new Error("Total marks must be a valid non-negative number.");

      const payload = {
        ...form,
        blueprint: {
          conductingBody: form.conductingBody,
          qualification: form.qualification,
          totalMarks, stages, pattern, markDistribution, cutoffs,
          verification: {
            status: form.verificationStatus,
            lastVerifiedAt: form.lastVerifiedAt || undefined
          }
        }
      };
      const response = await fetch("/api/admin/exams", {
        method: editing ? "PATCH" : "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error(result.error || "Could not save exam draft.");
      setNotice(editing ? "Draft updated; audit entry recorded." : "Draft created; audit entry recorded.");
      setShowForm(false); setForm(emptyForm); await loadExams();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save exam draft.");
    } finally { setSaving(false); }
  }

  const field = "mt-1.5 w-full rounded-xl border border-[#dce5dc] bg-white px-3.5 py-3 text-sm text-[#193326] outline-none focus:border-[#39885b]";
  const label = "text-sm font-semibold";
  const drafts = exams.filter(e => e.status === "draft").length;
  const published = exams.filter(e => e.status === "published").length;

  return <div className="space-y-7">
    <header>
      <p className="text-xs font-bold uppercase tracking-[.16em] text-[#16804a]">Canonical exam catalogue</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Exams Management</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">Manage exam blueprint drafts in canonical SARJOM records. Publishing is unavailable here.</p>
        </div>
        <button onClick={beginCreate} className="rounded-xl bg-[#176b3c] px-4 py-3 text-sm font-bold text-white">+ New exam draft</button>
      </div>
    </header>

    <section className="grid gap-3 sm:grid-cols-3">
      {[{label:"Canonical records",value:exams.length},{label:"Drafts",value:drafts},{label:"Published (locked)",value:published}].map(x =>
        <div key={x.label} className="rounded-2xl border border-[#dfe8df] bg-white p-5">
          <p className="text-sm text-slate-500">{x.label}</p><p className="mt-2 text-3xl font-black">{loading ? "—" : x.value}</p>
        </div>)}
    </section>

    {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
    {notice && <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">{notice}</div>}

    {showForm && <section className="rounded-2xl border border-[#dfe8df] bg-white p-5 shadow-sm sm:p-7">
      <div className="flex justify-between gap-3"><div><h2 className="text-xl font-bold">{editing ? "Edit exam draft" : "Create exam draft"}</h2>
        <p className="mt-1 text-sm text-slate-500">Array fields use JSON. Saves remain drafts; verification is not automatic.</p></div>
        <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border px-3 py-2 text-sm">Cancel</button></div>
      <form onSubmit={submit} className="mt-6 grid gap-5 md:grid-cols-2">
        <label className={label}>Exam title *<input required maxLength={250} className={field} value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label>
        <label className={label}>Display name<input maxLength={250} className={field} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
        <label className={label}>Conducting body<input maxLength={250} className={field} value={form.conductingBody} onChange={e=>setForm({...form,conductingBody:e.target.value})}/></label>
        <label className={label}>Qualification / eligibility<input maxLength={2000} className={field} value={form.qualification} onChange={e=>setForm({...form,qualification:e.target.value})}/></label>
        <label className={label}>Total marks<input type="number" min="0" step="any" className={field} value={form.totalMarks} onChange={e=>setForm({...form,totalMarks:e.target.value})}/></label>
        <label className={label}>State code<input maxLength={20} className={field} value={form.stateCode} onChange={e=>setForm({...form,stateCode:e.target.value})} placeholder="OD"/></label>
        <label className={`${label} md:col-span-2`}>Description<textarea rows={3} maxLength={4000} className={field} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label>
        <label className={label}>Official notification URL<input type="url" className={field} value={form.officialUrl} onChange={e=>setForm({...form,officialUrl:e.target.value})} placeholder="https://…"/></label>
        <label className={label}>Official source name<input maxLength={250} className={field} value={form.officialSource} onChange={e=>setForm({...form,officialSource:e.target.value})}/></label>

        <label className={`${label} md:col-span-2`}>Exam pattern — JSON array<textarea required rows={7} spellCheck={false} className={`${field} font-mono`} value={form.pattern} onChange={e=>setForm({...form,pattern:e.target.value})}/><span className="mt-1 block text-xs font-normal text-slate-500">Fields may include paper, subject, questions, marks, duration, negative.</span></label>
        <label className={`${label} md:col-span-2`}>Syllabus / weightage — JSON array<textarea required rows={6} spellCheck={false} className={`${field} font-mono`} value={form.markDistribution} onChange={e=>setForm({...form,markDistribution:e.target.value})}/><span className="mt-1 block text-xs font-normal text-slate-500">Example item: section, marks, keyTopics.</span></label>
        <label className={`${label} md:col-span-2`}>Selection stages — JSON array<textarea required rows={4} spellCheck={false} className={`${field} font-mono`} value={form.stages} onChange={e=>setForm({...form,stages:e.target.value})}/><span className="mt-1 block text-xs font-normal text-slate-500">Example: ["CBT","PST/PET","Document verification"].</span></label>
        <label className={`${label} md:col-span-2`}>Cutoff archive — JSON array<textarea required rows={6} spellCheck={false} className={`${field} font-mono`} value={form.cutoffs} onChange={e=>setForm({...form,cutoffs:e.target.value})}/><span className="mt-1 block text-xs font-normal text-slate-500">Record year, category, marks and source notes. Do not invent missing cutoffs.</span></label>
        <label className={label}>Verification status<select className={field} value={form.verificationStatus} onChange={e=>setForm({...form,verificationStatus:e.target.value})}><option value="unverified">Unverified</option><option value="pending">Pending review</option><option value="verified">Verified by admin</option></select></label>
        <label className={label}>Last verified date<input type="date" className={field} value={form.lastVerifiedAt} onChange={e=>setForm({...form,lastVerifiedAt:e.target.value})}/></label>
        {editing && <label className={`${label} md:col-span-2`}>Reason for change *<input required maxLength={500} className={field} value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})}/></label>}
        <div className="flex gap-3 md:col-span-2"><button disabled={saving} className="rounded-xl bg-[#176b3c] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? "Saving…" : editing ? "Save draft changes" : "Create draft"}</button>
          <button type="button" onClick={()=>setShowForm(false)} className="rounded-xl border px-5 py-3 text-sm">Cancel</button></div>
      </form>
    </section>}

    <section className="overflow-hidden rounded-2xl border border-[#dfe8df] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5"><div><h2 className="font-bold">Exam records</h2><p className="mt-1 text-xs text-slate-500">Canonical SARJOM repository</p></div>
        <div className="flex gap-2"><input aria-label="Search exams" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search exams…" className="w-48 rounded-xl border px-3 py-2.5 text-sm"/>
          <button onClick={()=>void loadExams()} className="rounded-xl border px-3 py-2.5 text-sm font-semibold">Refresh</button></div></div>
      {loading ? <p className="p-6 text-sm text-slate-500">Loading…</p> : filtered.length===0 ? <p className="p-8 text-center text-sm text-slate-500">No matching canonical exam records.</p> :
        <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-[#f7faf6] text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Exam</th><th className="px-5 py-3">Official source</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Updated</th><th className="px-5 py-3">Action</th></tr></thead>
          <tbody className="divide-y">{filtered.map(exam=><tr key={exam.id} className="align-top hover:bg-slate-50/70"><td className="px-5 py-4"><p className="font-bold">{exam.title}</p><p className="mt-1 text-xs text-slate-400">{exam.id}</p></td>
            <td className="px-5 py-4">{exam.officialSource || "Not specified"}</td><td className="px-5 py-4">{exam.status || "unspecified"}</td>
            <td className="px-5 py-4">{exam.updatedAt ? new Date(exam.updatedAt).toLocaleString() : "—"}</td><td className="px-5 py-4">{exam.status==="draft" ? <button onClick={()=>beginEdit(exam)} className="rounded-lg border px-3 py-2 text-xs font-bold">Edit draft</button> : <span className="text-xs text-slate-400">Locked</span>}</td></tr>)}</tbody></table></div>}
    </section>
    <p className="text-xs leading-5 text-slate-500">Publishing remains disabled. Saving the record and audit entry are separate repository writes. Verify persistent storage before relying on records across restarts.</p>
  </div>;
}