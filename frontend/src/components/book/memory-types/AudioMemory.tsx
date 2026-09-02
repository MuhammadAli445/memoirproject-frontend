'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import type { BookMemory } from '@/data/book'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function AudioMemory({ memory }: { memory: BookMemory }) {
  const duration = memory.audioDurationSeconds ?? 60
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev >= duration) {
            setPlaying(false)
            return duration
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [playing, duration])

  const togglePlay = () => {
    if (elapsed >= duration) setElapsed(0)
    setPlaying((p) => !p)
  }

  return (
    <div className="min-h-[calc(100vh-7rem)] bg-book-surface px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-serif text-4xl text-book-on-surface">{memory.title}</h1>

        <div className="mt-8 flex items-center gap-4 rounded-xl bg-book-primary px-6 py-5 text-book-on-primary shadow-md">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? 'Pause' : 'Play'}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30"
          >
            {playing ? <Pause className="h-5 w-5" strokeWidth={2} /> : <Play className="ml-0.5 h-5 w-5" strokeWidth={2} />}
          </button>
          <span className="font-book-sans text-sm tabular-nums">{formatTime(elapsed)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            value={elapsed}
            onChange={(e) => setElapsed(Number(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/30 accent-white"
            aria-label="Seek"
          />
          <span className="font-book-sans text-sm tabular-nums">{formatTime(duration)}</span>
        </div>

        <div className="mt-8 space-y-4 font-book-sans text-[16px] leading-relaxed text-book-on-surface">
          {memory.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {memory.transcript && (
          <>
            <div className="mt-10 h-px bg-book-outline-variant" />
            <h2 className="mt-8 font-serif text-2xl text-book-on-surface">Transcript of Recording</h2>
            <div className="mt-4 rounded-lg border border-book-outline-variant bg-book-surface-container-low p-5 font-book-sans text-sm leading-relaxed text-book-on-surface-variant">
              {memory.transcript.map((line, index) => (
                <p key={index} className={index > 0 ? 'mt-2' : ''}>
                  {line}
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
