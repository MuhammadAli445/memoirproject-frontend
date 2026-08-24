"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { beginGoogleSignIn, login } from "@/lib/auth-api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const canSubmit = Boolean(email) && Boolean(password) && !busy;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-serif text-3xl text-charcoal">Welcome back</h1>
        <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
          Sign in to return to your family&apos;s memoir.
        </p>

        <form
          className="mt-8 flex flex-col gap-4 rounded-2xl border border-charcoal/10 bg-white p-6 text-left"
          onSubmit={handleSubmit}
        >
          <label className="flex flex-col gap-2 text-sm font-medium text-charcoal">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              autoComplete="email"
              className="rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm font-normal text-charcoal placeholder:text-charcoal/35 focus:border-terracotta focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-charcoal">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
              className="rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm font-normal text-charcoal placeholder:text-charcoal/35 focus:border-terracotta focus:outline-none"
            />
          </label>

          {error && (
            <p role="alert" className="text-xs text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 w-full rounded-full bg-terracotta px-8 py-3 text-sm font-medium text-cream transition-colors hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Log in"}
          </button>

          <div className="flex items-center justify-between text-xs">
            <Link href="/forgot-password" className="text-charcoal/60 underline hover:text-charcoal">
              Forgot password?
            </Link>
            <Link href="/onboarding" className="text-charcoal/60 hover:text-charcoal">
              New here? Begin a memoir
            </Link>
          </div>

          <div className="flex items-center gap-3 text-xs text-charcoal/40">
            <span className="h-px flex-1 bg-charcoal/10" />
            OR
            <span className="h-px flex-1 bg-charcoal/10" />
          </div>

          <button
            type="button"
            onClick={beginGoogleSignIn}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-charcoal/15 bg-white px-8 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-charcoal/5"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path fill="#EA4335" d="M15.5 8.18c0-.57-.05-1.11-.14-1.64H8v3.1h4.2a3.6 3.6 0 0 1-1.56 2.37v1.94h2.52c1.48-1.36 2.34-3.36 2.34-5.77Z" />
              <path fill="#34A853" d="M8 16c2.1 0 3.86-.7 5.15-1.9l-2.52-1.95c-.7.47-1.6.75-2.63.75-2.02 0-3.73-1.36-4.34-3.19H1.05v2.01A8 8 0 0 0 8 16Z" />
              <path fill="#FBBC05" d="M3.66 9.71a4.8 4.8 0 0 1 0-3.42V4.28H1.05a8 8 0 0 0 0 7.44l2.61-2Z" />
              <path fill="#4285F4" d="M8 3.1c1.14 0 2.17.39 2.97 1.16l2.23-2.23A7.95 7.95 0 0 0 8 0 8 8 0 0 0 1.05 4.28l2.61 2.01C4.27 4.46 5.98 3.1 8 3.1Z" />
            </svg>
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}
