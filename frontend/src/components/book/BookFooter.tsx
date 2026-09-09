'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { BookNavEntry } from '@/lib/book-nav'

interface BookFooterProps {
  prev: BookNavEntry | null
  next: BookNavEntry | null
  chapterCount: number
  chapterNumber?: number
}

export default function BookFooter({ prev, next, chapterCount, chapterNumber }: BookFooterProps) {
  const router = useRouter()

  return (
    <footer className="sticky bottom-0 z-30 flex h-14 items-center justify-between gap-3 bg-book-inverse-surface px-4 text-book-inverse-on-surface sm:px-6">
      <button
        type="button"
        disabled={!prev}
        onClick={() => prev && router.push(prev.href)}
        className={`flex min-w-0 items-center gap-1.5 text-sm transition ${
          prev ? 'text-book-inverse-on-surface hover:text-book-primary-container' : 'invisible'
        }`}
      >
        <ChevronLeft className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
        <span className="truncate">
          <span className="hidden sm:inline">Previous Memory: </span>
          {prev?.label}
        </span>
      </button>

      <span className="flex-shrink-0 text-sm font-medium uppercase tracking-wide text-book-inverse-on-surface/70">
        {chapterNumber ? `Chapter ${chapterNumber} of ${chapterCount}` : 'Front Matter'}
      </span>

      <button
        type="button"
        disabled={!next}
        onClick={() => next && router.push(next.href)}
        className={`flex min-w-0 items-center gap-1.5 text-sm transition ${
          next ? 'text-book-inverse-on-surface hover:text-book-primary-container' : 'invisible'
        }`}
      >
        <span className="truncate">
          <span className="hidden sm:inline">Next Memory: </span>
          {next?.label}
        </span>
        <ChevronRight className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
      </button>
    </footer>
  )
}
