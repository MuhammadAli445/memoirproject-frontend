import type { BookMemory } from '@/data/book'

export default function TextMemory({ memory }: { memory: BookMemory }) {
  return (
    <div className="min-h-[calc(100vh-7rem)] bg-book-surface px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-serif text-4xl text-book-on-surface">{memory.title}</h1>
        <p className="mt-2 font-book-sans text-sm text-book-on-surface-variant">
          {memory.date ? `${memory.date} · ` : ''}
          {memory.contributor}
        </p>
        <div className="mx-auto mt-2 h-px w-16 bg-book-outline-variant" />

        <div className="mt-8 space-y-5 font-serif text-lg leading-relaxed text-book-on-surface">
          {memory.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <p className="mt-8 font-book-sans text-sm italic text-book-on-surface-variant">{memory.attribution}</p>
      </div>
    </div>
  )
}
