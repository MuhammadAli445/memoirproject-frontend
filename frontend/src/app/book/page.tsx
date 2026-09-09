'use client'

import Link from 'next/link'
import BookChrome from '@/components/book/BookChrome'
import { useMemoirData } from '@/data/book'

export default function BookCoverPage() {
  const { bookMeta } = useMemoirData()
  return (
    <BookChrome headerVariant="overlay">
      <div className="relative flex min-h-[calc(100vh-7rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-[#4a2f22] via-[#7a4326] to-[#c2703f] px-6 py-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_100%)]" />
        <div className="relative z-10 max-w-2xl">
          <p className="font-serif text-2xl italic text-book-inverse-on-surface/80">A Memoir</p>
          <h1 className="mt-2 font-serif text-5xl font-bold uppercase tracking-wide text-book-inverse-on-surface sm:text-6xl">
            {bookMeta.title}
          </h1>
          <p className="mt-6 font-serif text-xl text-book-inverse-on-surface/85">
            — {bookMeta.subtitle}
          </p>
          <p className="mt-4 font-serif text-base text-book-inverse-on-surface/60">{bookMeta.published}</p>

          <Link
            href="/book/about"
            className="mt-12 inline-flex items-center gap-2 rounded-full bg-book-primary px-8 py-3 font-book-sans text-sm font-semibold text-book-on-primary shadow-lg transition hover:bg-book-primary-container"
          >
            Begin Reading
          </Link>
        </div>
      </div>
    </BookChrome>
  )
}
