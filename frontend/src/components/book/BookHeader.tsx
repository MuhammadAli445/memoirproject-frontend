'use client'

import { ArrowLeft, Menu, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface BookHeaderProps {
  title: string
  variant?: 'overlay' | 'solid'
  chapterLabel?: string
  onMenuClick: () => void
}

export default function BookHeader({ title, variant = 'solid', chapterLabel, onMenuClick }: BookHeaderProps) {
  const router = useRouter()

  const isOverlay = variant === 'overlay'

  return (
    <header
      className={`sticky top-0 z-30 flex h-14 items-center justify-between px-4 sm:px-6 ${
        isOverlay
          ? 'bg-book-inverse-surface/35 text-book-inverse-on-surface backdrop-blur-sm'
          : 'bg-book-primary text-book-on-primary'
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex items-center gap-1.5 rounded-full p-2.5 pr-3 transition hover:bg-white/15"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2} />
          <span className="hidden text-sm font-medium sm:inline">Back</span>
        </button>
        <Link href="/book" className="font-serif text-[17px] tracking-wide">
          {title}
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {chapterLabel && (
          <span className="hidden font-serif text-sm italic opacity-90 sm:inline">{chapterLabel}</span>
        )}
        <button
          type="button"
          aria-label="Search"
          className="flex items-center gap-1.5 rounded-full p-2.5 transition hover:bg-white/15 sm:pr-4"
        >
          <Search className="h-5 w-5" strokeWidth={2} />
          <span className="hidden text-sm font-medium sm:inline">Search</span>
        </button>
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open table of contents"
          className="flex items-center gap-1.5 rounded-full p-2.5 transition hover:bg-white/15 sm:pr-4"
        >
          <Menu className="h-5 w-5" strokeWidth={2} />
          <span className="hidden text-sm font-medium sm:inline">Contents</span>
        </button>
      </div>
    </header>
  )
}
