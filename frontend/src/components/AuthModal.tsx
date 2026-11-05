"use client";

import { supabase } from "@/lib/supabase";






import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";


type Mode = "login" | "signup";

export default function AuthModal() {
  const router = useRouter();
  // Using shared supabase client
  

  const [mode, setMode] = useState<Mode>("login");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const requested = (event as CustomEvent<Mode>).detail;
      setMode(requested === "signup" ? "signup" : "login");
      setError("");
      setMessage("");
      setOpen(true);
    };
    window.addEventListener("sarjom:auth-modal", handleOpen);
    return () => window.removeEventListener("sarjom:auth-modal", handleOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, busy]);

  function switchMode(next: Mode) {
    if (busy) return;
    setMode(next);
    setError("");
    setMessage("");
  }

  async function continueWithGoogle() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=/`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo }
      });
      if (oauthError) throw oauthError;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign-in could not be started.");
      setBusy(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setMessage("");

    try {
      if (mode === "signup") {
        if (fullName.trim().length < 2) throw new Error("Please enter your full name.");
        if (password.length < 8) throw new Error("Use a password with at least 8 characters.");
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        if (!termsAccepted) throw new Error("Please accept the Terms and Conditions.");

        const { data, error: signupError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              mobile: mobile.trim() || null,
            }
          }
        });
        if (signupError) throw signupError;

        if (data.session) {
          setMessage("Account created successfully.");
          setOpen(false);
          router.replace("/");
          router.refresh();
        } else {
          setMessage("Registration submitted. Check your email to confirm your account if email confirmation is enabled.");
          setPassword("");
          setConfirmPassword("");
        }
        return;
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      if (authError) throw authError;
      if (!data.session?.access_token) throw new Error("No session returned. Confirm your email if required.");

      const adminResponse = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: data.session.access_token }),
        cache: "no-store"
      });

      if (adminResponse.ok) {
        setOpen(false);
        router.replace("/admin");
        router.refresh();
        return;
      }

      if (adminResponse.status !== 403) {
        const result = await adminResponse.json().catch(() => null);
        throw new Error(result?.error || "Could not verify your account. Please try again.");
      }

      setOpen(false);
      router.replace("/");
      router.refresh();    } catch (e) {
      setError(e instanceof Error ? e.message : "Authentication failed. Please check your details.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/65 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={event => { if (event.target === event.currentTarget && !busy) setOpen(false); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="sarjom-auth-title"
        className="relative my-auto max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl">
        <button type="button" aria-label="Close authentication dialog" disabled={busy}
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-2xl text-slate-500 hover:bg-slate-100 disabled:opacity-50">×</button>

        <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
          <aside className="relative hidden min-w-0 overflow-hidden bg-gradient-to-br from-white via-emerald-50 to-green-100 p-8 lg:flex lg:flex-col xl:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 top-24 h-64 w-64 rounded-full border-[36px] border-emerald-100/70" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-green-200/40 blur-2xl" />

            <div className="relative flex items-center gap-3">
              <svg viewBox="0 0 48 48" className="h-12 w-12 shrink-0" aria-hidden="true">
                <path d="M40 5C19 5 7 17 7 32c0 6 4 10 10 10C32 42 42 25 40 5Z" fill="#248844"/>
                <path d="M7 42C17 30 25 21 38 8" fill="none" stroke="#A7E6AE" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M18 31c-1-7 1-13 6-18M25 24c5 0 9-2 12-6" fill="none" stroke="#A7E6AE" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <div>
                <p className="text-2xl font-black tracking-tight text-emerald-950">SARJOM</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-800">Exam Preparation Platform</p>
              </div>
            </div>

            <div className="relative mt-12">
              <p className="mb-3 text-sm font-bold tracking-wide text-emerald-700">SAME ASPIRATIONS. STRONGER YOU.</p>
              <h3 className="max-w-lg text-4xl font-black leading-[1.13] tracking-tight text-slate-900 xl:text-5xl">
                Your Exams.<br />
                Your Preparation.<br />
                <span className="text-emerald-700">Our Support.</span>
              </h3>
              <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
                Access previous year questions, mock tests, notes and smart practice tools for competitive exams—all in one place.
              </p>
            </div>

            <div className="relative mt-8 space-y-5">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">📚</span>
                <div>
                  <p className="font-bold text-slate-900">Previous Year Questions</p>
                  <p className="mt-1 text-sm text-slate-600">Topic-wise practice and revision</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">✍️</span>
                <div>
                  <p className="font-bold text-slate-900">Mock Tests</p>
                  <p className="mt-1 text-sm text-slate-600">Practice and check your preparation</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">📈</span>
                <div>
                  <p className="font-bold text-slate-900">Study Resources</p>
                  <p className="mt-1 text-sm text-slate-600">Notes, revision and exam resources</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">🎯</span>
                <div>
                  <p className="font-bold text-slate-900">Multiple Exams</p>
                  <p className="mt-1 text-sm text-slate-600">Find preparation resources for your goals</p>
                </div>
              </div>
            </div>

            <div className="relative mt-auto border-t border-emerald-200/80 pt-6">
              <p className="text-sm italic leading-6 text-slate-600">
                “Discipline today, the career you dream of tomorrow.”
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                Your preparation journey starts here
              </div>
            </div>
          </aside>

          <div className="min-w-0 p-5 sm:p-8">
                    <div className="pr-8">
          <p className="text-xs font-black tracking-[0.18em] text-[#9a7100]">SARJOM-EXAM</p>
          <h2 id="sarjom-auth-title" className="mt-2 text-2xl font-black tracking-tight">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {mode === "login" ? "Sign in to continue your exam preparation." : "Start your exam preparation journey."}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1" role="tablist" aria-label="Authentication mode">
          <button type="button" role="tab" aria-selected={mode === "login"} onClick={() => switchMode("login")}
            className={`rounded-lg px-3 py-2.5 text-sm font-bold transition ${mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>Log In</button>
          <button type="button" role="tab" aria-selected={mode === "signup"} onClick={() => switchMode("signup")}
            className={`rounded-lg px-3 py-2.5 text-sm font-bold transition ${mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>Sign Up</button>
        </div>

        <button type="button" onClick={continueWithGoogle} disabled={busy}
          className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:opacity-60">
          <svg viewBox="0 0 48 48" aria-hidden="true" className="h-5 w-5">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" transform="translate(0 4)"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.9 46.98 31.7 46.98 24.55Z"/>
            <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z" transform="translate(0 0)"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.88 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"/>
          </svg>
          Continue with Google
        </button>

        <div className="my-4 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />or continue with email<span className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={submit} className="space-y-3.5">
          {mode === "signup" && <>
            <div>
              <label htmlFor="auth-full-name" className="mb-1 block text-xs font-semibold text-slate-700">Full name</label>
              <input id="auth-full-name" autoComplete="name" required value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="Your full name" className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-100"/>
            </div>
            <div>
              <label htmlFor="auth-mobile" className="mb-1 block text-xs font-semibold text-slate-700">Mobile number (optional)</label>
              <input id="auth-mobile" type="tel" autoComplete="tel" value={mobile} onChange={e => setMobile(e.target.value)}
                placeholder="Mobile number" className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-100"/>
            </div>
          </>}

          <div>
            <label htmlFor="auth-email" className="mb-1 block text-xs font-semibold text-slate-700">Email address</label>
            <input id="auth-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-100"/>
          </div>

          <div>
            <label htmlFor="auth-password" className="mb-1 block text-xs font-semibold text-slate-700">Password</label>
            <div className="flex rounded-xl border border-slate-300 focus-within:border-slate-700 focus-within:ring-2 focus-within:ring-slate-100">
              <input id="auth-password" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={mode === "signup" ? 8 : undefined} required value={password} onChange={e => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "At least 8 characters" : "Enter your password"}
                className="min-w-0 flex-1 rounded-l-xl bg-transparent px-3.5 py-3 text-sm outline-none"/>
              <button type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? "Hide password" : "Show password"}
                className="px-3 text-xs font-semibold text-slate-500 hover:text-slate-900">{showPassword ? "Hide" : "Show"}</button>
            </div>
          </div>

          {mode === "signup" && <>
            <div>
              <label htmlFor="auth-confirm-password" className="mb-1 block text-xs font-semibold text-slate-700">Confirm password</label>
              <div className="flex rounded-xl border border-slate-300 focus-within:border-slate-700">
                <input id="auth-confirm-password" type={showConfirm ? "text" : "password"} autoComplete="new-password" minLength={8} required
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter password"
                  className="min-w-0 flex-1 rounded-l-xl bg-transparent px-3.5 py-3 text-sm outline-none"/>
                <button type="button" onClick={() => setShowConfirm(v => !v)} aria-label={showConfirm ? "Hide confirmation password" : "Show confirmation password"}
                  className="px-3 text-xs font-semibold text-slate-500">{showConfirm ? "Hide" : "Show"}</button>
              </div>
            </div>
            <label className="flex items-start gap-2 text-xs leading-5 text-slate-600">
              <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="mt-1 accent-slate-800"/>
              <span>I agree to the <a href="/terms" className="font-semibold underline">Terms and Conditions</a>.</span>
            </label>
          </>}

          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {message && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}

          <button type="submit" disabled={busy}
            className="w-full rounded-xl bg-[#101b35] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#1b2b4e] disabled:cursor-wait disabled:opacity-60">
            {busy ? "Please wait…" : mode === "login" ? "Log In" : "Create Account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          {mode === "login" ? "New to SARJOM? " : "Already have an account? "}
          <button type="button" onClick={() => switchMode(mode === "login" ? "signup" : "login")} disabled={busy}
            className="font-bold text-[#172746] underline underline-offset-2">
            {mode === "login" ? "Create an account" : "Log in"}
          </button>
        </p>
          </div>
        </div>
      </section>
    </div>
  );
}

