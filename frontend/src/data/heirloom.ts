'use client'

import { useMemo } from 'react'
import { useMemoirData, type BookMemory, type BookMemoryType } from './book'

// The Access & Sharing System (search, share link, reflections, manage access) is a
// second "view" onto the same memoir rendered at /book — all content below is derived
// live from useMemoirData() so the two experiences never drift apart.

function initialsOf(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'FM'
  )
}

export interface Reflection {
  id: string
  author: string
  relation: string
  timeAgo: string
  body: string
  likes: number
}

export interface FamilyMemory {
  id: string
  author: string
  relation: string
  initials: string
  date: string
  postedLabel: string
  era: string
  title: string
  quote: string
  footnote?: string
  image?: { caption: string; meta: string }
  likes: number
  noteCount?: number
  featured?: string
}

export interface SearchResult {
  id: string
  kind: 'chapter' | 'photo' | 'recording'
  category: 'chapters' | 'photos' | 'recordings'
  badge: string
  title: string
  excerpt: string
  metaLeft: string
  metaAuthor?: string
  actionLabel: string
  image?: { caption: string; meta: string }
}

export interface HeirloomData {
  memoirMeta: {
    slug: string
    title: string
    subtitle: string
    volume: string
    establishedYear: number
    chapterCount: number
    archiveCode: string
    publicUrl: string
    visitsThisMonth: number
    reflectionsPosted: number
    totalContributors: number
    createdLabel: string
    updatedLabel: string
    chapters: number
    stories: number
    photos: number
    reflections: number
  }
  initialReflections: Reflection[]
  chapterOne: {
    bgClassName: string
    title: string
    dedicatedTo: string
    curatedBy: string
    readTime: string
    paragraphs: string[]
    photoCaption: string
    photoCredit: string
    closingParagraphs: string[]
    livingPassage: string
    finalParagraph: string
  }
  familyMemories: FamilyMemory[]
  searchResults: SearchResult[]
}

const SHARE_SLUG = 'family-memoir-4f9k2p'

function likesFor(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) % 97
  return 3 + (hash % 14)
}

function footnoteFor(memory: BookMemory): string | undefined {
  if (memory.type === 'video') return `${memory.durationLabel ?? ''} · Filmed by ${memory.filmedBy ?? 'family'}`.trim()
  if (memory.type === 'audio') return 'Family audio recording'
  return undefined
}

const actionLabelByType: Record<BookMemoryType, string> = {
  quote: 'Read Story',
  text: 'Read Story',
  photo: 'View Photo',
  audio: 'Listen',
  video: 'Watch',
}

const badgeNounByType: Record<BookMemoryType, string> = {
  quote: 'Story',
  text: 'Story',
  photo: 'Photograph',
  audio: 'Audio',
  video: 'Video',
}

function categoryOf(type: BookMemoryType): SearchResult['category'] {
  if (type === 'photo') return 'photos'
  if (type === 'audio' || type === 'video') return 'recordings'
  return 'chapters'
}

function kindOf(type: BookMemoryType): SearchResult['kind'] {
  if (type === 'photo') return 'photo'
  if (type === 'audio' || type === 'video') return 'recording'
  return 'chapter'
}

const FALLBACK_PARAGRAPH =
  "This story is just beginning. The first memory added here will appear as the opening page of this chapter."
const FALLBACK_PASSAGE = 'Every memory shared here — a story, a photo, a voice recording — becomes another page in this memoir.'

/** Everything the Access & Sharing screens (public view, search, family memories, manage) need — derived live from the same real memoir shown at /book. */
export function useHeirloomData(): HeirloomData {
  const { bookMeta, bookStats, chapters } = useMemoirData()

  return useMemo(() => {
    const chapter = chapters[0]
    const chapterMemories = chapter.memories

    const memoirMeta = {
      slug: SHARE_SLUG,
      title: bookMeta.title,
      subtitle: bookMeta.subtitle,
      volume: 'Volume I',
      establishedYear: new Date().getFullYear(),
      chapterCount: chapters.length,
      archiveCode: 'FAM-MEM-2026',
      publicUrl: `https://memoirproject.org/m/${SHARE_SLUG}`,
      visitsThisMonth: 0,
      reflectionsPosted: 0,
      totalContributors: bookStats.contributors,
      createdLabel: 'Created today',
      updatedLabel: 'Just now',
      chapters: chapters.length,
      stories: chapterMemories.filter((m) => m.type === 'text' || m.type === 'quote').length,
      photos: chapterMemories.filter((m) => m.type === 'photo').length,
      reflections: 0,
    }

    const initialReflections: Reflection[] = []

    const photoMemory = chapterMemories.find((m) => m.type === 'photo')
    const narrativeMemories = chapterMemories.filter((m) => m !== photoMemory)
    const first = narrativeMemories[0]
    const second = narrativeMemories[1]

    const chapterOne = {
      bgClassName: chapter.bgClassName,
      title: `Chapter 1: ${chapter.title}`,
      dedicatedTo: bookMeta.title,
      curatedBy: chapterMemories[0]?.contributor ?? 'The Family',
      readTime: chapterMemories.length > 0 ? '5 min read' : '1 min read',
      paragraphs: [first?.body[0] ?? FALLBACK_PARAGRAPH, first?.body[1] ?? second?.body[0] ?? FALLBACK_PASSAGE],
      photoCaption: photoMemory?.caption ?? photoMemory?.title ?? '',
      photoCredit: photoMemory ? photoMemory.attribution.replace(/^—\s*/, '') : '',
      closingParagraphs: [second?.body[0] ?? first?.body[2] ?? FALLBACK_PASSAGE],
      livingPassage: first ? first.body[Math.min(2, first.body.length - 1)] : FALLBACK_PASSAGE,
      finalParagraph: second ? second.body[second.body.length - 1] : first?.body[first.body.length - 1] ?? FALLBACK_PARAGRAPH,
    }

    const familyMemories: FamilyMemory[] = chapters.flatMap((c) =>
      c.memories.map((memory) => ({
        id: memory.id,
        author: memory.contributor,
        relation: 'Family',
        initials: initialsOf(memory.contributor),
        date: memory.date ?? c.dateRange,
        postedLabel: `From Chapter ${c.number}: ${c.title}`,
        era: `Era: ${c.tagline}`,
        title: memory.title,
        quote: memory.body.join(' '),
        footnote: footnoteFor(memory),
        image: memory.type === 'photo' ? { caption: memory.caption ?? memory.title, meta: 'Family Archive Print' } : undefined,
        likes: likesFor(memory.id),
      })),
    )

    const searchResults: SearchResult[] = chapters.flatMap((c) =>
      c.memories.map((memory) => ({
        id: memory.id,
        kind: kindOf(memory.type),
        category: categoryOf(memory.type),
        badge: `Chapter ${c.number} • ${badgeNounByType[memory.type]}`,
        title: memory.title,
        excerpt: memory.type === 'photo' ? memory.caption ?? memory.title : memory.body[0],
        metaLeft: memory.date ?? c.tagline,
        metaAuthor: memory.contributor,
        actionLabel: actionLabelByType[memory.type],
        image: memory.type === 'photo' ? { caption: memory.caption ?? memory.title, meta: 'Family Archive Print' } : undefined,
      })),
    )

    return { memoirMeta, initialReflections, chapterOne, familyMemories, searchResults }
  }, [bookMeta, bookStats, chapters])
}
