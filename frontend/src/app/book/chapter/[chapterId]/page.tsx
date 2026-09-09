'use client'

import { notFound } from 'next/navigation'
import { use } from 'react'
import BookChrome from '@/components/book/BookChrome'
import { useMemoirData } from '@/data/book'

export default function ChapterPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = use(params)
  const { findChapter } = useMemoirData()
  const chapter = findChapter(chapterId)

  if (!chapter) notFound()

  return (
    <BookChrome headerVariant="overlay">
      <div
        className={`flex min-h-[calc(100vh-7rem)] items-center justify-center bg-gradient-to-br px-6 py-20 text-center ${chapter.bgClassName}`}
      >
        <div className="max-w-2xl">
          <p className="font-serif text-2xl italic text-book-primary">
            Chapter {chapter.number === 1 ? 'One' : chapter.number === 2 ? 'Two' : 'Three'}
          </p>
          <h1 className="mt-2 font-serif text-5xl font-bold uppercase tracking-wide text-book-on-surface sm:text-6xl">
            {chapter.title}
          </h1>
          <p className="mt-4 font-book-sans text-sm text-book-on-surface-variant">
            {chapter.dateRange} • {chapter.tagline}
          </p>

          <blockquote className="mx-auto mt-14 max-w-xl font-serif text-3xl leading-snug text-book-on-surface">
            &ldquo;{chapter.coverQuote}&rdquo;
          </blockquote>
          <p className="mt-6 font-book-sans text-sm text-book-on-surface-variant">
            — {chapter.coverAttribution}
          </p>
        </div>
      </div>
    </BookChrome>
  )
}
