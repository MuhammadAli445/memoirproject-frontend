"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { consumeOAuthFragment } from "@/lib/auth-api";

function CallbackHandler() {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    const tokens = consumeOAuthFragment();
    if (tokens) {
      router.replace("/dashboard");
    } else {
      setError(true);
    }
  }, [router]);

  if (error) {
    return (
      <div className="w-full max-w-sm text-center">
        <h1 className="font-serif text-3xl text-charcoal">
          We couldn&apos;t complete sign-in
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
          The sign-in link seems to be missing its credentials. Please try
          again.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-block w-full rounded-full bg-terracotta px-8 py-3 text-sm font-medium text-cream transition-colors hover:bg-terracotta-dark"
        >
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <p className="text-sm leading-relaxed text-charcoal/60" aria-live="polite">
      Signing you in…
    </p>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6">
      <Suspense fallback={null}>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
