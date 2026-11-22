"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Eye, EyeOff, User, Mail, Phone, Lock, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
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
    if (!agreedTerms) return setError("Please accept the Terms & Conditions and Privacy Policy.");

    setBusy(true);
    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            mobile: mobile.trim() || null,
          },
        },
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
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/` },
    });
    if (oauthError) setError(oauthError.message);
  }

  return (
    <main className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center bg-background px-4 py-10 text-text-primary transition-colors">
      <motion.section
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-7 shadow-xl sm:p-8"
      >
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
          SARJOM <span className="font-semibold text-primary">EXAM</span>
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
          Create your free account
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          Create a candidate account to start preparing.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm font-medium text-danger"
          >
            {error}
          </p>
        )}

        {message && (
          <p
            role="status"
            className="mt-4 rounded-xl border border-primary/40 bg-primary/10 p-3 text-sm font-medium text-primary"
          >
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={googleSignup}
          className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-text-primary transition hover:border-primary/60 hover:bg-background/80"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M12 5c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.79 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.91 6.16-4.91z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">
            or register with email
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="space-y-3.5">
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              aria-label="Full name"
              placeholder="Full name"
              required
              minLength={2}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              aria-label="Email"
              type="email"
              placeholder="Email address"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="relative">
            <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              aria-label="Mobile (optional)"
              type="tel"
              placeholder="Mobile number (optional)"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              aria-label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Password (at least 8 characters)"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-11 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-text-secondary transition hover:text-text-primary"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              aria-label="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-11 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-text-secondary transition hover:text-text-primary"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-xs leading-relaxed text-text-secondary">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="font-semibold text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-semibold text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <button
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:opacity-90 disabled:opacity-50"
          >
            <span>{busy ? "Creating account…" : "Create account"}</span>
            {!busy && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </motion.section>
    </main>
  );
}