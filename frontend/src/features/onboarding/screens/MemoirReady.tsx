"use client";

interface MemoirReadyProps {
  onGoToMemoir: () => void;
  onInviteLater: () => void;
}

export function MemoirReady({ onGoToMemoir, onInviteLater }: MemoirReadyProps) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div
        className="pointer-events-none absolute top-16 h-56 w-56 rounded-full opacity-80 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(194,104,61,0.55) 0%, rgba(250,246,240,0) 70%)",
        }}
        aria-hidden="true"
      />

      <h1 className="relative max-w-sm font-serif text-3xl leading-snug text-charcoal">
        Your memoir space is ready.
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-charcoal/60">
        You have created the beginning of a family story. You can now invite
        your family to add their memories.
      </p>

      <button
        type="button"
        onClick={onGoToMemoir}
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-terracotta px-8 py-3 text-sm font-medium text-cream transition-colors hover:bg-terracotta-dark"
      >
        Go to my memoir
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M2 7h10M8 3l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        type="button"
        onClick={onInviteLater}
        className="mt-3 rounded-full border border-charcoal/20 px-8 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-charcoal/5"
      >
        Invite family later
      </button>
    </div>
  );
}
