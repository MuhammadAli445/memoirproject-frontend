"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/auth-api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const canSubmit = Boolean(email) && !busy;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    try {
      // The API responds identically whether or not the email exists.
      await requestPasswordReset(email);
    } finally {
      setSent(true);
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm text-center">
        {sent ? (
          <>
            <h1 className="font-serif text-3xl text-charcoal">Check your email</h1>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
              If <span className="font-medium text-charcoal">{email}</span> is
              registered, a password reset link is on its way. The link expires
              in 30 minutes.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-block w-full rounded-full bg-terracotta px-8 py-3 text-sm font-medium text-cream transition-colors hover:bg-terracotta-dark"
            >
              Back to log in
            </Link>
          </>
        ) : (
          <>
            <h1 className="font-serif text-3xl text-charcoal">Forgot your password?</h1>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
              No trouble — enter the email you signed up with and we&apos;ll
              send you a link to set a new one.
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

              <button
                type="submit"
                disabled={!canSubmit}
                className="mt-2 w-full rounded-full bg-terracotta px-8 py-3 text-sm font-medium text-cream transition-colors hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? "Sending…" : "Send reset link"}
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-sm text-charcoal/60">
          <Link href="/login" className="text-terracotta underline">
            Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
}
