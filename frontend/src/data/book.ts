'use client'

import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useMemories } from '../context/MemoryContext'
import { useSubject } from './subject'
import { useOnboardingSnapshot } from './onboardingSnapshot'
import { formatDuration } from '../utils/format'
import type { Memory } from '../types'

export type BookMemoryType = 'quote' | 'photo' | 'video' | 'audio' | 'text'

export interface BookMemory {
  id: string
  chapterId: string
  title: string
  type: BookMemoryType
  date?: string
  contributor: string
  body: string[]
  attribution: string
  caption?: string
  durationLabel?: string
  filmedBy?: string
  transcript?: string[]
  audioDurationSeconds?: number
  bgClassName: string
}

export interface BookChapter {
  id: string
  number: number
  title: string
  dateRange: string
  tagline: string
  coverQuote: string
  coverAttribution: string
  bgClassName: string
  memories: BookMemory[]
}

export interface FamilyTreeNode {
  name: string
  children?: FamilyTreeNode[]
}

export interface MemoirData {
  bookMeta: { title: string; subtitle: string; published: string }
  bookStats: { contributors: number; memories: number; decadesSpanned: number; generations: number }
  aboutText: { paragraphs: string[]; closing: string }
  chapters: BookChapter[]
  familyTree: FamilyTreeNode
  findMemory: (memoryId: string) => BookMemory | undefined
  findChapter: (chapterId: string) => BookChapter | undefined
}

// Same warm gradient palette as the original design — only the words change, never the colors.
const CHAPTER_GRADIENT = 'from-[#f5c98a] via-[#eeae6c] to-[#e08a52]'
const MEMORY_GRADIENTS = [
  'from-[#d9a86c] via-[#c98a58] to-[#8a5a3c]',
  'from-[#efe6da] to-[#d8c8b0]',
  'from-[#f3ece3] to-[#e6d8c5]',
  'from-[#f0ddc4] to-[#e3bd94]',
  'from-[#dcb488] via-[#c58f5c] to-[#7a4a2c]',
  'from-[#c9754a] via-[#a8532e] to-[#5c2c17]',
]

function mapMemoryType(type: Memory['type']): BookMemoryType {
  return type === 'voice' ? 'audio' : type
}

function paragraphsFrom(body: string): string[] {
  const parts = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  return parts.length > 0 ? parts : [body]
}

/** Builds the reader's memoir data live from the real onboarding answers and the memories the user has actually recorded. Same layout/types/colors as before — only the content is real. */
export function useMemoirData(): MemoirData {
  const subject = useSubject()
  const onboarding = useOnboardingSnapshot()
  const { memories } = useMemories()
  const { user } = useAuth()

  return useMemo(() => {
    const title = subject.name
    const contributorName = user?.full_name?.trim() || 'The Family'

    const bookMeta = {
      title,
      subtitle: 'A Memoir Collected by Family',
      published: `Published ${new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`,
    }

    const startYear = subject.birthYear
    const endYear = subject.deathYear ?? new Date().getFullYear()
    const decadesSpanned = startYear ? Math.max(1, Math.ceil((endYear - startYear) / 10)) : 1

    const bookStats = {
      contributors: 1,
      memories: memories.length,
      decadesSpanned,
      generations: 1,
    }

    const description = onboarding?.description?.trim()
    const familyHopes = onboarding?.familyHopes?.trim()

    const aboutText = {
      paragraphs: [
        description || `This memoir is a growing collection of memories for ${title}, gathered by the people who love them.`,
        memories.length > 0
          ? `So far, ${memories.length} ${memories.length === 1 ? 'memory has' : 'memories have'} been added here, each one another page in this story.`
          : `This collection is just beginning. Every memory added here — a story, a photo, a voice recording — becomes another page in ${title}'s memoir.`,
      ],
      closing:
        familyHopes || `We hope this collection becomes a lasting way to remember ${title} and the life they shared with everyone who loved them.`,
    }

    const sortedMemories = [...memories].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )

    const bookMemories: BookMemory[] = sortedMemories.map((memory, index) => ({
      id: memory.id,
      chapterId: 'chapter-1',
      title: memory.title,
      type: mapMemoryType(memory.type),
      date: new Date(memory.createdAt).getFullYear().toString(),
      contributor: contributorName,
      body: paragraphsFrom(memory.body),
      attribution: `— ${contributorName}`,
      caption: memory.photoCaption,
      audioDurationSeconds: memory.audioDurationSeconds ?? undefined,
      durationLabel: memory.audioDurationSeconds ? formatDuration(memory.audioDurationSeconds) : undefined,
      bgClassName: MEMORY_GRADIENTS[index % MEMORY_GRADIENTS.length],
    }))

    const dateRange = startYear ? `${startYear} — ${subject.deathYear ?? 'Present'}` : ''

    const chapters: BookChapter[] = [
      {
        id: 'chapter-1',
        number: 1,
        title: 'Their Story',
        dateRange,
        tagline: 'Family Stories & Memories',
        coverQuote: description || 'Every memory shared here adds another page to this story.',
        coverAttribution: 'Written with love by the family',
        bgClassName: CHAPTER_GRADIENT,
        memories: bookMemories,
      },
    ]

    const familyTree: FamilyTreeNode = { name: title }

    function findMemory(memoryId: string): BookMemory | undefined {
      for (const chapter of chapters) {
        const memory = chapter.memories.find((m) => m.id === memoryId)
        if (memory) return memory
      }
      return undefined
    }

    function findChapter(chapterId: string): BookChapter | undefined {
      return chapters.find((c) => c.id === chapterId)
    }

    return { bookMeta, bookStats, aboutText, chapters, familyTree, findMemory, findChapter }
  }, [subject, onboarding, memories, user])
}
