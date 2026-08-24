"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/auth-api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const canSubmit =
    Boolean(email) &&
    /^\d{6}$/.test(code) &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword &&
    !busy;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await resetPassword(email, code, newPassword);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  }

  if (!email) {
    return (
      <div className="w-full max-w-sm text-center">
        <p className="text-sm leading-relaxed text-charcoal/60">
          We lost track of which email this reset is for.
        </p>
        <Link href="/forgot-password" className="mt-4 inline-block text-terracotta underline">
          Start again
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm text-center">
      <h1 className="font-serif text-3xl text-charcoal">Choose a new password</h1>
      <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
        We sent a six-digit code to{" "}
        <span className="font-medium text-charcoal">{email}</span>. Enter it
        below along with your new password.
      </p>

      <form
        className="mt-8 flex flex-col gap-4 rounded-2xl border border-charcoal/10 bg-white p-6 text-left"
        onSubmit={handleSubmit}
      >
        <label className="flex flex-col gap-2 text-sm font-medium text-charcoal">
          Reset code
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="123456"
            className="rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-center text-lg tracking-[0.4em] font-normal text-charcoal placeholder:text-charcoal/35 focus:border-terracotta focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-charcoal">
          New password
          <input
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            className="rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm font-normal text-charcoal placeholder:text-charcoal/35 focus:border-terracotta focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-charcoal">
          Confirm new password
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className="rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm font-normal text-charcoal focus:border-terracotta focus:outline-none"
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
          {busy ? "Saving…" : "Reset password"}
        </button>
      </form>

      <p className="mt-6 text-sm text-charcoal/60">
        Didn&apos;t get a code?{" "}
        <Link href="/forgot-password" className="text-terracotta underline">
          Send another
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
