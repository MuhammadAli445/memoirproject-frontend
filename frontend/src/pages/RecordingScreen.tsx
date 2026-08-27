import { useEffect, useState } from 'react'
import { Pause, Play, Square } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Sidebar from '../components/Sidebar'
import BackButton from '../components/BackButton'
import { useMemories } from '../context/MemoryContext'
import { subject } from '../data/sampleMemories'
import { formatDuration, fullDateUpper } from '../utils/format'
import type { WorkspaceTab } from '../components/Sidebar'
import type { Memory } from '../types'

export default function RecordingScreen() {
  const router = useRouter()
  const { memories } = useMemories()
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('voiceNotes')
  const [isPaused, setIsPaused] = useState(false)
  const [elapsed, setElapsed] = useState(194)

  const recordingMemory = memories.find((m) => m.id === 'seed-voice-1') as Memory

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(timer)
  }, [isPaused])

  const handleAddMemory = () => router.push('/workspace')

  return (
    <div className="flex min-h-screen bg-ink">
      <Sidebar subject={subject} activeTab={activeTab} onTabChange={setActiveTab} onAddMemory={handleAddMemory} />

      <main className="flex-1 overflow-y-auto px-10 py-10">
        <div className="mx-auto max-w-3xl animate-fadeIn">
          <div className="mb-6">
            <BackButton to="/workspace" />
          </div>
          {/* Header row */}
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs tracking-[0.14em] text-mist">
              {fullDateUpper(recordingMemory.createdAt)}
            </p>
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-ember">
              <span className="h-2 w-2 rounded-full bg-ember animate-recordPulse" />
              Recording
            </span>
          </div>
          <div className="mt-3 h-px bg-ink-600" />

          {/* Title */}
          <h1 className="mt-8 font-display text-[32px] font-medium text-linen">
            {recordingMemory.title}
          </h1>

          {/* Video / Audio player area */}
          <div className="mt-6 overflow-hidden rounded-xl bg-ink-700 shadow-card">
            <div className="relative aspect-video w-full bg-ink-800">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-display text-sm text-mist-dim">
                    {recordingMemory.body}
                  </p>
                </div>
              </div>
              {/* Fake player controls */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 border-t border-ink-600 bg-ink-800/90 px-4 py-2.5">
                <button type="button" className="text-mist hover:text-linen" aria-label="Previous">
                  <span className="text-xs">⏮</span>
                </button>
                <button type="button" className="text-ember hover:text-ember-hover" aria-label="Play">
                  <Play className="h-4 w-4" fill="currentColor" />
                </button>
                <button type="button" className="text-mist hover:text-linen" aria-label="Next">
                  <span className="text-xs">⏭</span>
                </button>
                <div className="h-1 flex-1 rounded-full bg-ink-600">
                  <div className="h-full w-[40%] rounded-full bg-ember" />
                </div>
                <span className="font-mono text-xs text-mist-dim">
                  {formatDuration(Math.floor(elapsed * 0.4))} / {formatDuration(elapsed)}
                </span>
              </div>
            </div>
          </div>

          {/* Recording control bar */}
          <div className="mt-6 flex items-center gap-4 rounded-xl border border-ink-600 bg-ink-800 px-6 py-5">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-ember animate-recordPulse" />
            </span>
            <span className="font-mono text-[28px] tabular-nums text-linen">
              {formatDuration(elapsed)}
            </span>

            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 text-mist transition hover:border-linen hover:text-linen"
                aria-label={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? (
                  <Play className="h-4 w-4" fill="currentColor" />
                ) : (
                  <Pause className="h-4 w-4" strokeWidth={2} />
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/workspace')}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-linen text-ink transition hover:bg-linen-dim"
                aria-label="Stop recording"
              >
                <Square className="h-4 w-4" fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
