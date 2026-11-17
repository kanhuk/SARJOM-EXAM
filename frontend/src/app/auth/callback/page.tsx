"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function finish() {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }

        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        const accessToken = data.session?.access_token;
        if (!accessToken) {
          throw new Error("Sign-in did not return a valid session. Please try again.");
        }

        const response = await fetch("/api/admin/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken }),
          cache: "no-store",
          credentials: "same-origin"
        });

        if (!active) return;

        if (response.ok) {
          router.replace("/admin");
          router.refresh();
          return;
        }

        if (response.status === 403) {
          router.replace("/");
          router.refresh();
          return;
        }

        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Could not verify your account. Please try again.");
      } catch (e) {
        if (active) {
          setError(e instanceof Error ? e.message : "Sign-in could not be completed.");
        }
      }
    }

    void finish();
    return () => { active = false; };
  }, [router]);

  return (
    <main className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-2xl font-black">Completing sign-in</h1>
      {error ? (
        <div role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-red-700">
          <p>{error}</p>
          <a className="mt-3 inline-block font-bold underline" href="/login">
            Return to login
          </a>
        </div>
      ) : (
        <p className="mt-3 text-slate-600">
          Please wait while SARJOM verifies your account…
        </p>
      )}
    </main>
  );
}