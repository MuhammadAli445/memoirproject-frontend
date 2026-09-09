'use client'

import { notFound } from 'next/navigation'
import { use } from 'react'
import BookChrome from '@/components/book/BookChrome'
import QuoteMemory from '@/components/book/memory-types/QuoteMemory'
import PhotoMemory from '@/components/book/memory-types/PhotoMemory'
import VideoMemory from '@/components/book/memory-types/VideoMemory'
import AudioMemory from '@/components/book/memory-types/AudioMemory'
import TextMemory from '@/components/book/memory-types/TextMemory'
import { useMemoirData } from '@/data/book'

const overlayTypes = new Set(['quote', 'video'])

export default function MemoryPage({ params }: { params: Promise<{ memoryId: string }> }) {
  const { memoryId } = use(params)
  const { findMemory } = useMemoirData()
  const memory = findMemory(memoryId)

  if (!memory) notFound()

  return (
    <BookChrome headerVariant={overlayTypes.has(memory.type) ? 'overlay' : 'solid'}>
      {memory.type === 'quote' && <QuoteMemory memory={memory} />}
      {memory.type === 'photo' && <PhotoMemory memory={memory} />}
      {memory.type === 'video' && <VideoMemory memory={memory} />}
      {memory.type === 'audio' && <AudioMemory memory={memory} />}
      {memory.type === 'text' && <TextMemory memory={memory} />}
    </BookChrome>
  )
}
