'use client'

import { useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import BookHeader from './BookHeader'
import BookFooter from './BookFooter'
import TocDrawer from './TocDrawer'
import { getNavInfo } from '@/lib/book-nav'

interface BookChromeProps {
  children: ReactNode
  headerVariant?: 'overlay' | 'solid'
  className?: string
}

export default function BookChrome({ children, headerVariant = 'solid', className = '' }: BookChromeProps) {
  const pathname = usePathname()
  const [tocOpen, setTocOpen] = useState(false)
  const nav = getNavInfo(pathname ?? '')

  return (
    <div className="flex min-h-screen flex-col bg-book-surface">
      <BookHeader
        variant={headerVariant}
        chapterLabel={nav.current?.chapterTitle ? `Chapter ${nav.current.chapterNumber}: ${nav.current.chapterTitle}` : undefined}
        onMenuClick={() => setTocOpen(true)}
      />
      <main className={`flex-1 ${className}`}>{children}</main>
      <BookFooter prev={nav.prev} next={nav.next} chapterCount={nav.chapterCount} chapterNumber={nav.current?.chapterNumber} />
      <TocDrawer open={tocOpen} onClose={() => setTocOpen(false)} />
    </div>
  )
}
