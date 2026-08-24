"use client";

interface BeginIntroProps {
  onBegin: () => void;
  onSkip: () => void;
}

export function BeginIntro({ onBegin, onSkip }: BeginIntroProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2l1.8 5.6L19.5 9l-5.7 1.4L12 16l-1.8-5.6L4.5 9l5.7-1.4L12 2ZM19 15l.9 2.8L22.5 18l-2.6.7L19 21.5l-.9-2.8L15.5 18l2.6-.7L19 15Z"
            fill="#C2683D"
          />
        </svg>
      </div>

      <h1 className="max-w-sm font-serif text-3xl leading-snug text-charcoal">
        Let&apos;s begin a memoir for someone you love.
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-charcoal/60">
        We&apos;ll help you create a space for your family&apos;s memories,
        stories, photographs, and voices.
      </p>

      <button
        type="button"
        onClick={onBegin}
        className="mt-10 rounded-full bg-terracotta px-10 py-3 text-sm font-medium text-cream transition-colors hover:bg-terracotta-dark"
      >
        Begin
      </button>

      <button
        type="button"
        onClick={onSkip}
        className="mt-4 text-sm text-charcoal/50 underline-offset-4 transition-colors hover:text-charcoal hover:underline"
      >
        Skip
      </button>
    </div>
  );
}
