import { useRef, useState } from 'react'
import { Camera, FileText, Mic, Pause, Play } from 'lucide-react'
import type { Memory } from '../types'
import { formatDuration, relativeTime } from '../utils/format'

const typeIcon = { text: FileText, photo: Camera, voice: Mic } as const

interface MemoryRowProps {
  memory: Memory
}

export default function MemoryRow({ memory }: MemoryRowProps) {
  const Icon = typeIcon[memory.type]
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const hasRealAudio = memory.type === 'voice' && Boolean(memory.audioUrl)

  const toggle = () => {
    if (!hasRealAudio || !audioRef.current) return
    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play()
  }

  return (
    <div className="flex items-start gap-4 border-b border-charcoal/10 py-5 last:border-b-0">
      {memory.type === 'voice' ? (
        <button
          type="button"
          onClick={toggle}
          disabled={!hasRealAudio}
          title={hasRealAudio ? (isPlaying ? 'Pause' : 'Play') : 'Preview unavailable in this demo'}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-terracotta/15 text-terracotta transition hover:bg-terracotta/25 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPlaying ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="ml-0.5 h-4 w-4" fill="currentColor" />}
        </button>
      ) : (
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-cream text-charcoal/50">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-[17px] text-charcoal">{memory.title}</h3>
          {memory.isDraft && (
            <span className="rounded-full bg-terracotta/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-terracotta">
              Draft
            </span>
          )}
          {memory.type === 'voice' && (
            <span className="text-xs text-charcoal/40">{formatDuration(memory.audioDurationSeconds ?? 0)}</span>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-charcoal/60">{memory.body}</p>
        <p className="mt-2 text-xs text-charcoal/40">
          {relativeTime(memory.createdAt)}
          {memory.location ? ` · ${memory.location}` : ''}
        </p>
      </div>

      {hasRealAudio && (
        <audio
          ref={audioRef}
          src={memory.audioUrl ?? undefined}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}
    </div>
  )
}
