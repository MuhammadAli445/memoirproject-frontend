'use client'

import { useState } from 'react'
import { Pause, Play } from 'lucide-react'
import type { BookMemory } from '@/data/book'

export default function VideoMemory({ memory }: { memory: BookMemory }) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className={`min-h-[calc(100vh-7rem)] bg-gradient-to-br px-6 py-16 ${memory.bgClassName}`}>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-serif text-4xl text-book-on-surface">{memory.title}</h1>

        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-pressed={playing}
          className="group relative mx-auto mt-8 flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-book-inverse-surface shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-book-cocoa/40 to-transparent" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-book-primary text-book-on-primary shadow-lg transition group-hover:bg-book-primary-container">
            {playing ? <Pause className="h-7 w-7" strokeWidth={2} /> : <Play className="ml-1 h-7 w-7" strokeWidth={2} />}
          </span>
          {playing && (
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 font-book-sans text-xs text-white">
              Playing (demo)
            </span>
          )}
        </button>

        <p className="mt-4 font-book-sans text-sm text-book-on-surface-variant">
          {memory.durationLabel && (
            <>
              <span className="font-semibold text-book-on-surface">Duration:</span> {memory.durationLabel}
              <br />
            </>
          )}
          {memory.filmedBy && <>Filmed by {memory.filmedBy}</>}
        </p>

        <div className="mx-auto mt-6 max-w-xl space-y-4 font-book-sans text-[16px] leading-relaxed text-book-on-surface">
          {memory.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <p className="mt-6 font-book-sans text-sm text-book-on-surface-variant">{memory.attribution}</p>
      </div>
    </div>
  )
}
