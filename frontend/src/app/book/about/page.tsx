'use client'

import { BookOpen, Calendar, Network, Users } from 'lucide-react'
import BookChrome from '@/components/book/BookChrome'
import { useMemoirData } from '@/data/book'

export default function AboutMemoirPage() {
  const { bookMeta, bookStats, aboutText } = useMemoirData()

  const stats = [
    { icon: Users, value: bookStats.contributors, label: 'Contributors' },
    { icon: BookOpen, value: bookStats.memories, label: 'Memories' },
    { icon: Calendar, value: bookStats.decadesSpanned, label: 'Decades Spanned' },
    { icon: Network, value: bookStats.generations, label: 'Generations' },
  ]

  return (
    <BookChrome>
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <h1 className="text-center font-serif text-4xl font-bold uppercase tracking-wide text-book-primary">
          About This Memoir
        </h1>

        <div className="mt-8 space-y-5 font-book-sans text-[17px] leading-relaxed text-book-on-surface">
          <p>
            This memoir, &ldquo;{bookMeta.title},&rdquo; is a growing collection of memories gathered by the people
            who love them.
          </p>
          <p>{aboutText.paragraphs[0]}</p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 rounded-xl bg-book-secondary-container/60 px-8 py-10 sm:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <Icon className="h-7 w-7 text-book-primary" strokeWidth={1.75} />
              <p className="mt-3 font-serif text-4xl font-bold text-book-primary">{value}</p>
              <p className="mt-1 font-book-sans text-sm font-semibold text-book-on-surface">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-5 font-book-sans text-[17px] leading-relaxed text-book-on-surface">
          <p>{aboutText.paragraphs[1]}</p>
        </div>

        <p className="mt-10 text-center font-serif text-lg italic text-book-primary">{aboutText.closing}</p>
      </div>
    </BookChrome>
  )
}
