"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setMessage("");

    if (fullName.trim().length < 2) return setError("Enter your full name.");
    if (password.length < 8) return setError("Use a password with at least 8 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    setBusy(true);
    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: fullName.trim(), mobile: mobile.trim() || null } }
      });
      if (signupError) throw signupError;

      if (data.session) {
        setMessage("Account created successfully.");
        router.replace("/");
        router.refresh();
      } else {
        setMessage("Registration submitted. Check your email to confirm your account, then sign in.");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Signup failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function googleSignup() {
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
        <h1 className="mt-2 text-2xl font-extrabold">Create your free account</h1>
        <p className="mt-2 text-sm text-slate-600">Create a candidate account to start preparing.</p>
        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {message && <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
        <button type="button" onClick={googleSignup} className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold">Continue with Google</button>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <input aria-label="Full name" placeholder="Full name" required minLength={2} value={fullName} onChange={e => setFullName(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
          <input aria-label="Email" type="email" placeholder="Email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
          <input aria-label="Mobile (optional)" type="tel" placeholder="Mobile (optional)" value={mobile} onChange={e => setMobile(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
          <input aria-label="Password" type="password" placeholder="Password (at least 8 characters)" required minLength={8} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
          <input aria-label="Confirm password" type="password" placeholder="Confirm password" required autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
          <button disabled={busy} className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-bold text-white disabled:opacity-50">{busy ? "Creating account…" : "Create account"}</button>
        </form>
        <p className="mt-5 text-sm text-slate-600">Already registered? <Link href="/login" className="font-semibold text-emerald-700">Sign in</Link></p>
      </section>
    </main>
  );
}