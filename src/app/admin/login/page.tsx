"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      if (authError) throw authError;
      if (!data.session?.access_token) throw new Error("No session returned. Confirm your email if required.");

      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: data.session.access_token }),
        cache: "no-store"
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true) {
        throw new Error(result?.error || (response.status === 403 ? "This account is not authorized as an administrator." : "Admin verification failed."));
      }

      setPassword("");
      router.replace("/admin");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Admin login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-12 text-slate-900">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-700">SARJOM-EXAM</p>
        <h1 className="mt-2 text-2xl font-black">Admin login</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in with your authorized administrator account.</p>
        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-semibold">Email</label>
            <input id="admin-email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-semibold">Password</label>
            <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>
          <button disabled={busy} className="w-full rounded-xl bg-blue-700 px-4 py-3 font-bold text-white disabled:opacity-50">{busy ? "Verifying…" : "Sign in securely"}</button>
        </form>
        <Link href="/login" className="mt-5 inline-block text-sm font-semibold text-blue-700 hover:underline">← Candidate login</Link>
      </section>
    </main>
  );
}