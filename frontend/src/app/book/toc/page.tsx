'use client'

import TocList from '@/components/book/TocList'
import { useMemoirData } from '@/data/book'

export default function TableOfContentsPage() {
  const { bookMeta } = useMemoirData()
  return (
    <div className="flex min-h-screen bg-book-surface">
      <aside className="w-[300px] flex-shrink-0 border-r border-book-outline-variant bg-book-surface-container-low px-6 py-8">
        <TocList />
      </aside>

      <main className="flex-1 px-10 py-14 sm:px-16">
        <div className="mx-auto max-w-xl">
          <h1 className="font-serif text-5xl font-bold uppercase tracking-wide text-book-on-surface">
            Front Matter
          </h1>
          <div className="mt-8 space-y-5 font-book-sans text-[17px] leading-relaxed text-book-on-surface">
            <p>This section introduces the memoir, provides context, and includes acknowledgments.</p>
            <p>
              It gathers the notes written for {bookMeta.title} before their story begins — a word of thanks to
              everyone who shares a memory, and a short guide to how this collection is arranged, chapter by
              chapter, voice by voice.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
