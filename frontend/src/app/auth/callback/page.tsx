"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  ), []);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function finish() {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else {
          const { data, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;
          if (!data.session) throw new Error("Google sign-in did not return a session. Please try again.");
        }
        const requested = params.get("next") || "/";
        const safeNext = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/";
        router.replace(safeNext);
        router.refresh();
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Sign-in could not be completed.");
      }
    }
    void finish();
    return () => { active = false; };
  }, [router, supabase]);

  return <main className="mx-auto max-w-lg px-4 py-20 text-center">
    <h1 className="text-2xl font-black">Completing sign-in</h1>
    {error ? <div role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-red-700">
      <p>{error}</p><a className="mt-3 inline-block font-bold underline" href="/login">Return to login</a>
    </div> : <p className="mt-3 text-slate-600">Please wait while SARJOM verifies your session…</p>}
  </main>;
}
