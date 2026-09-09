'use client'

import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useMemoirData } from '@/data/book'

export default function TocList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { chapters } = useMemoirData()

  const isActive = (href: string) => pathname === href

  const linkClass = (href: string) =>
    `block rounded-md px-2 py-1.5 text-[15px] transition ${
      isActive(href)
        ? 'font-semibold text-book-primary'
        : 'text-book-on-surface hover:text-book-primary'
    }`

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-1">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="rounded-full p-2.5 text-book-primary transition hover:bg-book-primary/10"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2} />
        </button>
        <Link
          href="/dashboard"
          aria-label="Go to dashboard"
          className="rounded-full p-2.5 text-book-primary transition hover:bg-book-primary/10"
        >
          <Home className="h-5 w-5" strokeWidth={2} />
        </Link>
      </div>

      <h2 className="mt-6 px-1 font-serif text-[26px] font-medium text-book-on-surface">
        Table of Contents
      </h2>

      <nav className="mt-6 flex-1 space-y-5 overflow-y-auto px-1 pb-6">
        <Link href="/book/about" onClick={onNavigate} className={linkClass('/book/about')}>
          About This Memoir
        </Link>

        <Link href="/book/family-tree" onClick={onNavigate} className={linkClass('/book/family-tree')}>
          Family Tree
        </Link>

        {chapters.map((chapter) => {
          const chapterHref = `/book/chapter/${chapter.id}`
          return (
            <div key={chapter.id}>
              <Link href={chapterHref} onClick={onNavigate} className={linkClass(chapterHref)}>
                Chapter {chapter.number}: {chapter.title}
              </Link>
              <div className="mt-2 space-y-2 border-l border-book-outline-variant pl-4">
                {chapter.memories.map((memory) => {
                  const memoryHref = `/book/memory/${memory.id}`
                  return (
                    <Link
                      key={memory.id}
                      href={memoryHref}
                      onClick={onNavigate}
                      className={`block text-base transition ${
                        isActive(memoryHref)
                          ? 'font-semibold text-book-primary'
                          : 'text-book-on-surface-variant hover:text-book-primary'
                      }`}
                    >
                      {memory.title}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>
    </div>
  )
}
