import type { BookMemory } from '@/data/book'

export default function QuoteMemory({ memory }: { memory: BookMemory }) {
  return (
    <div className={`flex min-h-[calc(100vh-7rem)] items-center justify-center bg-gradient-to-br px-6 py-20 ${memory.bgClassName}`}>
      <div className="max-w-2xl text-center">
        <h1 className="font-serif text-4xl font-medium text-book-on-surface sm:text-5xl">{memory.title}</h1>

        <div className="mx-auto mt-8 max-w-xl space-y-5 font-serif text-xl leading-relaxed text-book-on-surface/90">
          {memory.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <p className="mt-10 font-book-sans text-sm italic text-book-on-surface-variant">{memory.attribution}</p>
      </div>
    </div>
  )
}
