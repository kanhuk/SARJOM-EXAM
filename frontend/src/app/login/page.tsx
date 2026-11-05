"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
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
      if (!data.session?.access_token) {
        throw new Error("Login did not return a session. Confirm your email if required.");
      }

      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: data.session.access_token }),
        cache: "no-store"
      });

      if (response.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }

      if (response.status !== 403) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Could not verify your account. Please try again.");
      }

      router.replace("/");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed. Check your details.");
    } finally {
      setBusy(false);
    }
  }

  async function googleLogin() {
    setError("");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/` }
    });
    if (oauthError) setError(oauthError.message);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 text-slate-900">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">SARJOM-EXAM</p>
        <h1 className="mt-2 text-3xl font-extrabold">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in to continue your exam preparation.</p>
        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button type="button" onClick={googleLogin} className="mt-6 w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold">
          Continue with Google
        </button>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-semibold">Email</label>
            <input id="login-email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-semibold">Password</label>
            <input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>
          <button disabled={busy} className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-bold text-white disabled:opacity-50">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-5 text-sm text-slate-600">New to SARJOM? <Link href="/signup" className="font-semibold text-emerald-700">Create an account</Link></p>
        <p className="mt-3 text-sm"><Link href="/admin/login" className="text-slate-500 underline">Admin sign in</Link></p>
      </section>
    </main>
  );
}