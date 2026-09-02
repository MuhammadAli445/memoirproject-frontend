import { chapters } from '@/data/book'

export interface BookNavEntry {
  href: string
  label: string
  chapterNumber?: number
  chapterTitle?: string
}

export function getFlatSequence(): BookNavEntry[] {
  const entries: BookNavEntry[] = [
    { href: '/book', label: 'Cover' },
    { href: '/book/about', label: 'About This Memoir' },
    { href: '/book/family-tree', label: 'Family Tree' },
  ]

  for (const chapter of chapters) {
    entries.push({
      href: `/book/chapter/${chapter.id}`,
      label: `Chapter ${chapter.number}: ${chapter.title}`,
      chapterNumber: chapter.number,
      chapterTitle: chapter.tagline,
    })
    for (const memory of chapter.memories) {
      entries.push({
        href: `/book/memory/${memory.id}`,
        label: memory.title,
        chapterNumber: chapter.number,
        chapterTitle: chapter.tagline,
      })
    }
  }

  return entries
}

export interface BookNavInfo {
  prev: BookNavEntry | null
  next: BookNavEntry | null
  current: BookNavEntry | null
  chapterCount: number
}

export function getNavInfo(pathname: string): BookNavInfo {
  const sequence = getFlatSequence()
  const index = sequence.findIndex((entry) => entry.href === pathname)

  if (index === -1) {
    return { prev: null, next: null, current: null, chapterCount: chapters.length }
  }

  return {
    prev: index > 0 ? sequence[index - 1] : null,
    next: index < sequence.length - 1 ? sequence[index + 1] : null,
    current: sequence[index],
    chapterCount: chapters.length,
  }
}
