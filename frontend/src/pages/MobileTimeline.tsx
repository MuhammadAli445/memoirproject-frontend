import { useRef, useState } from 'react'
import { Camera, Mic, MoreVertical, Pause, Play, User } from 'lucide-react'
import BackButton from '../components/BackButton'
import { useSubject } from '../data/subject'
import { formatDuration, shortDate } from '../utils/format'
import type { Memory } from '../types'

const mobileMemories: Memory[] = [
  {
    id: 'mobile-voice-1',
    type: 'voice',
    title: 'The Old Bookstore in Cairo',
    body: 'I remember the smell of dust and old binding glue. It was 1968, and my father took me to find a specific edition of...',
    createdAt: '2023-10-12T10:00:00Z',
    isDraft: false,
    audioUrl: null,
    audioDurationSeconds: 252,
  },
  {
    id: 'mobile-text-1',
    type: 'photo',
    title: 'First Apartment',
    body: "It wasn't much, just two rooms above a bakery. But every morning the smell of fresh bread would wake us up before the alarm. Those were the hardest years, but perhaps the simplest ones too. We had nothing but time and each other.",
    createdAt: '2023-09-04T10:00:00Z',
    isDraft: false,
    location: 'London, UK',
    photoDataUrl: null,
  },
]

export default function MobileTimeline() {
  const subject = useSubject()
  return (
    <div className="mx-auto max-w-md min-h-screen bg-cream">
      {/* Mobile header */}
      <header className="flex items-center justify-between border-b border-charcoal/10 px-5 py-4">
        <BackButton to="/workspace" className="text-charcoal hover:text-terracotta" />
        <h1 className="font-display text-lg text-charcoal">The Memoir Project</h1>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-charcoal/50"
          aria-label="Profile"
        >
          <User className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </header>

      <div className="px-5 py-6">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-terracotta">Recent Entries</p>
        <h2 className="mt-1 font-display text-[26px] text-charcoal">{subject.name}&apos;s Timeline</h2>
      </div>

      <div className="space-y-5 px-5 pb-20">
        {mobileMemories.map((memory) => (
          <MobileMemoryCard key={memory.id} memory={memory} />
        ))}
      </div>

      {/* End of timeline */}
      <div className="flex flex-col items-center py-10 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
          <Mic className="h-4 w-4 text-charcoal/40" strokeWidth={1.75} />
        </div>
        <p className="mt-3 text-sm font-medium uppercase tracking-[0.12em] text-charcoal/40">
          End of Timeline
        </p>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t border-charcoal/10 bg-white px-6 py-3">
        <div className="flex items-center justify-around">
          <button type="button" className="flex flex-col items-center gap-1 text-terracotta" aria-label="Feed">
            <Camera className="h-5 w-5" strokeWidth={1.75} />
            <span className="text-sm font-medium uppercase tracking-wide">Feed</span>
          </button>
          <button
            type="button"
            className="flex h-12 w-12 -translate-y-4 items-center justify-center rounded-full bg-terracotta text-cream shadow-soft"
            aria-label="Add memory"
          >
            <span className="text-xl leading-none">+</span>
          </button>
          <button type="button" className="flex flex-col items-center gap-1 text-charcoal/50" aria-label="Settings">
            <span className="text-sm font-medium uppercase tracking-wide">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

function MobileMemoryCard({ memory }: { memory: Memory }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const toggle = () => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play()
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card">
      {/* Card header */}
      <div className="flex items-start justify-between px-5 pt-5">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.1em] text-charcoal/40">
            {memory.type === 'voice' ? 'Voice Note' : 'Written Memory'} · {shortDate(memory.createdAt)}
          </p>
          <h3 className="mt-1 font-display text-xl text-charcoal">{memory.title}</h3>
        </div>
        <button type="button" className="text-charcoal/40 hover:text-charcoal/60" aria-label="More options">
          <MoreVertical className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </div>

      {/* Photo if present */}
      {memory.type === 'photo' && (
        <div className="mx-5 mt-4 overflow-hidden rounded-lg bg-cream">
          <div className="flex aspect-[4/3] items-center justify-center">
            <Camera className="h-8 w-8 text-charcoal/30" strokeWidth={1.2} />
          </div>
        </div>
      )}

      <div className="px-5 py-4">
        <p className="text-[14px] leading-relaxed text-charcoal/60">{memory.body}</p>

        {/* Tags */}
        {(memory.location || memory.type === 'text') && (
          <div className="mt-3 flex flex-wrap gap-2">
            {memory.location && (
              <span className="inline-flex items-center gap-1 rounded-full bg-terracotta/10 px-3 py-1 text-sm font-medium text-terracotta">
                <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
                {memory.location}
              </span>
            )}
            {memory.type === 'text' && (
              <span className="rounded-full bg-cream px-3 py-1 text-sm font-medium text-charcoal/50">
                Family
              </span>
            )}
          </div>
        )}

        {/* Audio player for voice notes */}
        {memory.type === 'voice' && memory.audioDurationSeconds && (
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={toggle}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-terracotta text-cream transition hover:bg-terracotta-dark"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" fill="currentColor" />
              ) : (
                <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
              )}
            </button>
            {/* Waveform bars */}
            <div className="flex flex-1 items-end gap-[2px] h-5">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full bg-charcoal/15"
                  style={{ height: `${Math.max(3, Math.random() * 20)}px` }}
                />
              ))}
            </div>
            <span className="flex-shrink-0 font-mono text-sm text-charcoal/40">
              0:00 / {formatDuration(memory.audioDurationSeconds)}
            </span>
          </div>
        )}

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
    </div>
  )
}
