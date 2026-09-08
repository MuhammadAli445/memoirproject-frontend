import { bookMeta, bookStats, chapters as bookChapters, type BookMemory, type BookMemoryType } from './book'

// The Access & Sharing System (search, share link, reflections, manage access) is a
// second "view" onto the same memoir rendered at /book — all content below is derived
// from src/data/book.ts so the two experiences never drift apart.

const founderChapter = bookChapters[0]
const [startYearLabel] = founderChapter.dateRange.split('—').map((s) => s.trim())

const contributorRelation: Record<string, string> = {
  Amina: 'Granddaughter',
  Sara: 'Granddaughter',
  Omar: 'Son',
  Dina: 'Granddaughter',
  Mariam: 'Granddaughter',
  Layla: 'Granddaughter',
  Karim: 'Grandson',
  'Family gathering': 'Family',
}

function relationOf(contributor: string): string {
  return contributorRelation[contributor] ?? 'Family'
}

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

export const memoirMeta = {
  slug: 'ayesha-family-legacy-4f9k2p',
  title: bookMeta.title,
  subtitle: bookMeta.subtitle,
  volume: 'Volume I',
  establishedYear: Number(startYearLabel) || 1970,
  chapterCount: bookChapters.length,
  archiveCode: 'AYE-LHR-1970',
  publicUrl: `https://memoirproject.org/m/ayesha-family-legacy-4f9k2p`,
  visitsThisMonth: 128,
  reflectionsPosted: 2,
  totalContributors: bookStats.contributors,
  createdLabel: `Est. ${startYearLabel}`,
  updatedLabel: '2 days ago',
  chapters: bookChapters.length,
  stories: bookChapters
    .flatMap((c) => c.memories)
    .filter((m) => m.type === 'text' || m.type === 'quote').length,
  photos: bookChapters.flatMap((c) => c.memories).filter((m) => m.type === 'photo').length,
  reflections: 2,
}

export interface Reflection {
  id: string
  author: string
  relation: string
  timeAgo: string
  body: string
  likes: number
}

export const initialReflections: Reflection[] = [
  {
    id: 'r1',
    author: 'Dina',
    relation: relationOf('Dina'),
    timeAgo: '2 days ago',
    body: "Reading Chapter One brought back the smell of her kitchen so vividly. Grandma always had a story ready before the tea had even finished steeping. Thank you for gathering all of this, it means everything to have it written down.",
    likes: 5,
  },
  {
    id: 'r2',
    author: 'Karim',
    relation: relationOf('Karim'),
    timeAgo: 'Yesterday',
    body: 'I remember visiting her in Lahore every summer. The way she greeted everyone at the door, like you were the only person she had been waiting for all day. This memoir captures her exactly as I remember her.',
    likes: 3,
  },
]

const founderQuoteMemory = founderChapter.memories.find((m) => m.type === 'quote')!
const founderPhotoMemory = founderChapter.memories.find((m) => m.type === 'photo')!
const founderTextMemory = founderChapter.memories.find((m) => m.type === 'text')!

export const chapterOne = {
  bgClassName: founderChapter.bgClassName,
  title: `Chapter 1: ${founderChapter.title}`,
  dedicatedTo: 'Grandma Ayesha and Her Family',
  curatedBy: 'Amina',
  readTime: '5 min read',
  paragraphs: [founderQuoteMemory.body[0], founderQuoteMemory.body[2]],
  photoCaption: founderPhotoMemory.caption ?? founderPhotoMemory.title,
  photoCredit: founderPhotoMemory.attribution.replace(/^—\s*/, ''),
  closingParagraphs: [founderPhotoMemory.body[0]],
  livingPassage: founderQuoteMemory.body[1],
  finalParagraph: founderTextMemory.body[founderTextMemory.body.length - 1],
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

function likesFor(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) % 97
  return 3 + (hash % 14)
}

function footnoteFor(memory: BookMemory, type: BookMemoryType): string | undefined {
  if (type === 'video') return `${memory.durationLabel ?? ''} · Filmed by ${memory.filmedBy ?? 'family'}`.trim()
  if (type === 'audio') return 'Family audio recording'
  return undefined
}

export const familyMemories: FamilyMemory[] = bookChapters.flatMap((chapter) =>
  chapter.memories.map((memory) => ({
    id: memory.id,
    author: memory.contributor,
    relation: relationOf(memory.contributor),
    initials: initialsOf(memory.contributor),
    date: memory.date ?? chapter.dateRange,
    postedLabel: `From Chapter ${chapter.number}: ${chapter.title}`,
    era: `Era: ${chapter.tagline}`,
    title: memory.title,
    quote: memory.body.join(' '),
    footnote: footnoteFor(memory, memory.type),
    image: memory.type === 'photo' ? { caption: memory.caption ?? memory.title, meta: 'Family Archive Print' } : undefined,
    likes: likesFor(memory.id),
  })),
)

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

export const searchResults: SearchResult[] = bookChapters.flatMap((chapter) =>
  chapter.memories.map((memory) => ({
    id: memory.id,
    kind: kindOf(memory.type),
    category: categoryOf(memory.type),
    badge: `Chapter ${chapter.number} • ${badgeNounByType[memory.type]}`,
    title: memory.title,
    excerpt: memory.type === 'photo' ? memory.caption ?? memory.title : memory.body[0],
    metaLeft: memory.date ?? chapter.tagline,
    metaAuthor: memory.contributor,
    actionLabel: actionLabelByType[memory.type],
    image: memory.type === 'photo' ? { caption: memory.caption ?? memory.title, meta: 'Family Archive Print' } : undefined,
  })),
)
