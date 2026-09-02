import { ImageOff } from 'lucide-react'
import type { BookMemory } from '@/data/book'

export default function PhotoMemory({ memory }: { memory: BookMemory }) {
  return (
    <div className={`min-h-[calc(100vh-7rem)] bg-gradient-to-br px-6 py-16 ${memory.bgClassName}`}>
      <div className="mx-auto max-w-2xl rounded-2xl bg-book-surface-container-lowest px-8 py-10 shadow-lg sm:px-14 sm:py-14">
        <h1 className="text-center font-serif text-3xl text-book-on-surface sm:text-4xl">{memory.title}</h1>
        <div className="mx-auto mt-3 h-px w-40 bg-book-outline-variant" />

        <div className="mt-8 overflow-hidden rounded-lg bg-book-surface-container">
          <div className="flex aspect-video items-center justify-center bg-gradient-to-b from-book-secondary-container to-book-surface-container-high">
            <ImageOff className="h-10 w-10 text-book-on-surface-variant/50" strokeWidth={1.25} />
          </div>
        </div>
        {memory.caption && (
          <p className="mt-3 text-center font-book-sans text-sm italic text-book-on-surface-variant">
            {memory.caption}
          </p>
        )}

        <div className="mt-8 space-y-5 text-center font-book-sans text-[16px] leading-relaxed text-book-on-surface">
          {memory.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <p className="mt-8 text-center font-book-sans text-sm text-book-on-surface-variant">{memory.attribution}</p>
      </div>
    </div>
  )
}
