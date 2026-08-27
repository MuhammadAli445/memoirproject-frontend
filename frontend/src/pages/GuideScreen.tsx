import { useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, Pencil } from 'lucide-react'
import BackButton from '../components/BackButton'

type Tab = 'record' | 'type'

export default function GuideScreen() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('record')
  const [typedText, setTypedText] = useState('')

  const goRecord = () => router.push('/workspace')
  const goType = () => router.push('/workspace')

  const handleContinue = () => {
    if (tab === 'type') goType()
    else goRecord()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linen px-6 py-12">
      <div className="absolute left-6 top-6 z-10">
        <BackButton to="/" className="text-cocoa/60 hover:text-cocoa" />
      </div>
      <div className="grid w-full max-w-4xl grid-cols-1 gap-10 md:grid-cols-[280px_1fr]">
        {/* Clio panel */}
        <div className="animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-ember-soft text-lg font-display text-ember">
              C
            </span>
            <div>
              <p className="font-display text-lg text-cocoa">Clio</p>
              <p className="text-sm text-cocoa/50">Your Guide</p>
            </div>
          </div>

          <blockquote className="mt-8 border-l-2 border-ember/40 pl-4 font-display text-xl italic leading-snug text-cocoa">
            &quot;Two minutes or ten — there&apos;s no wrong way to do this.&quot;
          </blockquote>

          <p className="mt-6 border-l border-cocoa/15 pl-4 text-[15px] leading-relaxed text-cocoa/60">
            Take a deep breath. Speak from the heart, or write down whatever comes to mind first.
          </p>
        </div>

        {/* Record / Type panel */}
        <div className="animate-fadeIn rounded-2xl bg-white shadow-card">
          <div className="flex border-b border-cocoa/10 px-6">
            <TabButton active={tab === 'record'} onClick={() => setTab('record')} icon={<Mic className="h-4 w-4" strokeWidth={1.75} />}>
              Record
            </TabButton>
            <TabButton active={tab === 'type'} onClick={() => setTab('type')} icon={<Pencil className="h-4 w-4" strokeWidth={1.75} />}>
              Type
            </TabButton>
          </div>

          <div className="flex min-h-[320px] flex-col items-center justify-center px-8 py-10 text-center">
            {tab === 'record' ? (
              <>
                <button
                  type="button"
                  onClick={goRecord}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-ember-soft text-ember transition hover:bg-ember/25"
                  aria-label="Tap to start recording"
                >
                  <Mic className="h-7 w-7" strokeWidth={1.75} />
                </button>
                <p className="mt-6 font-display text-lg text-cocoa">Tap to start recording</p>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-cocoa/55">
                  Share your thoughts out loud. We&apos;ll transcribe it and help you refine it later.
                </p>
              </>
            ) : (
              <textarea
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder="Write down whatever comes to mind first..."
                rows={8}
                className="w-full flex-1 resize-none border-none bg-transparent text-left text-[15px] leading-relaxed text-cocoa placeholder:text-cocoa/35 focus:outline-none"
              />
            )}
          </div>

          <div className="flex justify-end border-t border-cocoa/10 px-6 py-4">
            <button
              type="button"
              onClick={handleContinue}
              className="rounded-lg bg-ember px-7 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-ember-hover"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition ${
        active ? 'border-ember text-ember' : 'border-transparent text-cocoa/45 hover:text-cocoa/70'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}
