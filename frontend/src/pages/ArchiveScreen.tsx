import { useRef, useState } from 'react'
import { Camera, FileText, Mic, Pause, Play, SlidersHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Sidebar from '../components/Sidebar'
import BackButton from '../components/BackButton'
import { useMemories } from '../context/MemoryContext'
import { subject } from '../data/sampleMemories'
import { formatDuration, relativeTime } from '../utils/format'
import type { WorkspaceTab } from '../components/Sidebar'
import type { Memory, MemoryType } from '../types'

type FilterType = 'all' | MemoryType | 'fragment' | 'draft'

const typeIcon: Record<MemoryType, typeof FileText> = {
  text: FileText,
  photo: Camera,
  voice: Mic,
}

export default function ArchiveScreen() {
  const router = useRouter()
  const { memories } = useMemories()
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('memories')
  const [filter, setFilter] = useState<FilterType>('all')
  const [showFilter, setShowFilter] = useState(false)

  const handleAddMemory = () => router.push('/workspace')

  const filteredMemories = memories.filter((m) => {
    if (filter === 'all') return true
    if (filter === 'draft') return m.isDraft
    if (filter === 'fragment') return m.type === 'text' && !m.isDraft
    return m.type === filter
  })

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar subject={subject} activeTab={activeTab} onTabChange={setActiveTab} onAddMemory={handleAddMemory} />

      <main className="flex-1 overflow-y-auto px-10 py-10">
        <div className="mx-auto max-w-3xl animate-fadeIn">
          <div className="mb-6">
            <BackButton to="/workspace" />
          </div>
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="font-display text-3xl text-charcoal">Archive</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-charcoal/50">
                {filteredMemories.length} {filteredMemories.length === 1 ? 'entry' : 'entries'} recorded
              </span>
              <button
                type="button"
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-charcoal/50 transition hover:text-charcoal"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={2} />
                Filter
              </button>
            </div>
          </div>

          {/* Filter pills */}
          {showFilter && (
            <div className="mt-4 flex flex-wrap gap-2">
              {(['all', 'text', 'voice', 'photo', 'fragment', 'draft'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition ${
                    filter === f
                      ? 'bg-terracotta text-cream'
                      : 'border border-charcoal/15 text-charcoal/60 hover:border-terracotta hover:text-charcoal'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          {/* Memory cards */}
          <div className="mt-8 space-y-6">
            {filteredMemories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}

            {filteredMemories.length === 0 && (
              <p className="py-16 text-center text-sm text-charcoal/50">No memories match this filter.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function MemoryCard({ memory }: { memory: Memory }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const Icon = typeIcon[memory.type]

  const toggle = () => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play()
  }

  return (
    <div className="rounded-2xl bg-white shadow-card overflow-hidden">
      {memory.type === 'photo' && (
        <div className="px-8 pt-8">
          <h2 className="font-display text-2xl text-charcoal">{memory.title}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.1em] text-charcoal/40">
            <span>{new Date(memory.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }).toUpperCase()}</span>
            {memory.location && (
              <>
                <span>·</span>
                <span>LOCATION: {memory.location.toUpperCase()}</span>
              </>
            )}
          </div>
          {/* Photo */}
          <div className="mt-4 overflow-hidden rounded-lg bg-cream">
            <div className="flex aspect-video items-center justify-center">
              <Camera className="h-8 w-8 text-charcoal/30" strokeWidth={1.2} />
            </div>
          </div>
        </div>
      )}

      {/* Audio player for voice/photo with audio */}
      {memory.audioDurationSeconds && (
        <div className="mx-8 mt-4 rounded-lg border border-charcoal/10 bg-cream p-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggle}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-charcoal/15 text-charcoal transition hover:bg-white"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" fill="currentColor" />
              ) : (
                <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
              )}
            </button>
            {/* Waveform bars */}
            <div className="flex flex-1 items-end gap-[3px] h-6">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full bg-charcoal/20"
                  style={{ height: `${Math.max(4, Math.random() * 24)}px` }}
                />
              ))}
            </div>
            <span className="flex-shrink-0 font-mono text-xs text-charcoal/40">
              {formatDuration(memory.audioDurationSeconds)}
            </span>
          </div>
          {memory.audioUrl && (
            <audio
              ref={audioRef}
              src={memory.audioUrl}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          )}
        </div>
      )}

      <div className="px-8 py-6">
        {/* Quote / body */}
        {memory.type === 'photo' && memory.photoCaption ? (
          <p className="font-display text-[15px] italic leading-relaxed text-charcoal/60">
            &ldquo;{memory.photoCaption}&rdquo;
          </p>
        ) : memory.type === 'text' && memory.isDraft ? (
          <div className="rounded-lg border border-dashed border-charcoal/15 bg-cream p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.1em] text-charcoal/40">
              <span>Draft</span>
              <span>·</span>
              <span>{relativeTime(memory.updatedAt ?? memory.createdAt)}</span>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-charcoal/60">
              {memory.body}
            </p>
          </div>
        ) : memory.type === 'voice' && !memory.audioDurationSeconds ? (
          <div className="rounded-lg bg-cream p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.1em] text-charcoal/40">
              <Mic className="h-3.5 w-3.5" strokeWidth={2} />
              <span>Voice Note</span>
              <span>·</span>
              <span>DURATION: {formatDuration(memory.audioDurationSeconds ?? 0)}</span>
            </div>
          </div>
        ) : (
          <p className="text-[15px] leading-relaxed text-charcoal/60">{memory.body}</p>
        )}
      </div>
    </div>
  )
}
