"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clearTokens, fetchProfile, getAccessToken, type UserProfile } from "@/lib/auth-api";

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [signedOut, setSignedOut] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) {
      setSignedOut(true);
      return;
    }
    fetchProfile()
      .then(setProfile)
      .catch(() => {
        clearTokens();
        setSignedOut(true);
      });
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      {signedOut ? (
        <>
          <h1 className="font-serif text-2xl text-charcoal">Your memoir dashboard</h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-charcoal/60">
            You&apos;re not signed in yet.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/login"
              className="rounded-full bg-terracotta px-8 py-3 text-sm font-medium text-cream transition-colors hover:bg-terracotta-dark"
            >
              Log in
            </Link>
            <Link
              href="/onboarding"
              className="rounded-full border border-charcoal/15 bg-white px-8 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-charcoal/5"
            >
              Begin a memoir
            </Link>
          </div>
        </>
      ) : (
        <>
          <h1 className="font-serif text-2xl text-charcoal">
            Welcome{profile?.name ? `, ${profile.name}` : ""}
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-charcoal/60">
            {profile
              ? `Signed in as ${profile.email}${profile.is_oauth_user ? " (via Google)" : ""}.`
              : "Loading your profile…"}{" "}
            The full dashboard isn&apos;t built yet.
          </p>
          <button
            type="button"
            onClick={() => {
              clearTokens();
              setSignedOut(true);
            }}
            className="mt-6 rounded-full border border-charcoal/15 bg-white px-8 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-charcoal/5"
          >
            Sign out
          </button>
        </>
      )}
    </div>
  );
}
