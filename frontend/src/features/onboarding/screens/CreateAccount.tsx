"use client";

import { useState } from "react";
import Link from "next/link";
import { beginGoogleSignIn, signup } from "@/lib/auth-api";

interface CreateAccountProps {
  onBack: () => void;
  onClose: () => void;
  onCreateAccount: (payload: { name: string; email: string; password: string }) => void;
}

export function CreateAccount({ onBack, onClose, onCreateAccount }: CreateAccountProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const canSubmit = Boolean(name && email && password && agreed) && !busy;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setError(null);
    try {
      await signup(name, email, password);
      onCreateAccount({ name, email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-6 py-5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="text-charcoal/60 transition-colors hover:text-charcoal"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M12.5 15.5 6.5 10l6-5.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-charcoal/60 transition-colors hover:text-charcoal"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M4 4l10 10M14 4 4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-6 text-center">
        <h1 className="font-serif text-3xl text-charcoal">
          Save your memoir and continue.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
          Create an account to protect your memoir, invite your family, and
          return to it whenever you wish.
        </p>

        <form
          className="mt-8 flex flex-col gap-4 rounded-2xl border border-charcoal/10 bg-white p-6 text-left"
          onSubmit={handleSubmit}
        >
          <label className="flex flex-col gap-2 text-sm font-medium text-charcoal">
            Full Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm font-normal text-charcoal placeholder:text-charcoal/35 focus:border-terracotta focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-charcoal">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm font-normal text-charcoal placeholder:text-charcoal/35 focus:border-terracotta focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-charcoal">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm font-normal text-charcoal focus:border-terracotta focus:outline-none"
            />
          </label>

          <label className="flex items-start gap-2 text-xs text-charcoal/70">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              I agree to the{" "}
              <a href="#" className="text-terracotta underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-terracotta underline">
                Privacy Policy
              </a>
              .
            </span>
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
            {busy ? "Creating account…" : "Create Account"}
          </button>

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

        <p className="mt-6 text-sm text-charcoal/60">
          Already have an account?{" "}
          <Link href="/login" className="text-terracotta underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
