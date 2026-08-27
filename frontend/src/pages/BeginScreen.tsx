import { Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BeginScreen() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-linen px-6">
      <div className="w-full max-w-md animate-fadeIn rounded-2xl bg-white px-10 py-14 text-center shadow-card">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ember-soft">
          <Sparkles className="h-5 w-5 animate-sparkle text-ember" strokeWidth={1.75} />
        </span>

        <h1 className="mt-7 text-balance font-display text-[30px] font-semibold leading-[1.25] text-ember">
          Let&apos;s begin a memoir for someone you love.
        </h1>

        <p className="mx-auto mt-4 max-w-xs text-[15px] leading-relaxed text-cocoa/60">
          We&apos;ll help you create a space for your family&apos;s memories, photographs, and voices.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => router.push('/guide')}
            className="w-full rounded-full bg-ember px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-ember-hover hover:shadow-soft active:translate-y-0"
          >
            Begin
          </button>
          <button
            type="button"
            onClick={() => router.push('/workspace')}
            className="text-xs font-semibold text-cocoa/40 transition hover:text-cocoa"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}
