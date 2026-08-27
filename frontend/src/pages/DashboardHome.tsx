import { BookOpen, Calendar, Camera, FileText, ImageOff, Mic, PenLine, Plus, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BackButton from '../components/BackButton'
import { useMemories } from '../context/MemoryContext'
import { subject } from '../data/sampleMemories'
import { relativeTime } from '../utils/format'
import type { Memory } from '../types'

type NavItem = 'memories' | 'voiceNotes' | 'timeline' | 'contributors'

const NAV_ITEMS: { id: NavItem; label: string; icon: typeof BookOpen }[] = [
  { id: 'memories', label: 'Memories', icon: BookOpen },
  { id: 'voiceNotes', label: 'Voice Notes', icon: Mic },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'contributors', label: 'Contributors', icon: Users },
]

const typeIcon = { text: FileText, photo: Camera, voice: Mic } as const

export default function DashboardHome() {
  const router = useRouter()
  const { memories } = useMemories()

  const recentMemories = memories.slice(0, 3)
  const hasMemories = memories.length > 0

  return (
    <div className="flex min-h-screen bg-ink">
      {/* Sidebar */}
      <aside className="flex h-screen w-[260px] flex-shrink-0 flex-col justify-between border-r border-ink-600 bg-ink-800 px-6 py-8">
        <div>
          <p className="text-sm text-mist-dim">The Memoir Project</p>

          <div className="mt-10">
            <h1 className="font-display text-[22px] font-medium text-linen">{subject.name}</h1>
            <p className="mt-0.5 text-sm text-mist-dim">
              {subject.birthYear} – {subject.deathYear}
            </p>
          </div>

          <nav className="mt-10 flex flex-col gap-1">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => router.push('/workspace', { state: { tab: id } })}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[15px] text-mist transition hover:bg-ink-700 hover:text-linen"
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <button
          type="button"
          onClick={() => router.push('/workspace')}
          className="flex items-center justify-center gap-2 rounded-lg bg-ember px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-ember-hover"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add Memory
        </button>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center px-10 py-10">
        <div className="absolute left-72 top-8">
          <BackButton to="/" />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center animate-fadeIn">
          {/* Framed portrait */}
          <div className="relative">
            <div className="rounded-xl border-[6px] border-ink-700 bg-ink-700 shadow-card">
              <div className="h-[300px] w-[240px] overflow-hidden rounded-lg bg-ink-600">
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-ink-600 to-ink-700">
                  <ImageOff className="h-12 w-12 text-mist-dim" strokeWidth={1.2} />
                </div>
              </div>
            </div>
            {/* Caption plate */}
            <div className="absolute -bottom-4 left-1/2 w-[85%] -translate-x-1/2 rounded-lg bg-ink-700 px-3 py-1.5 text-center">
              <p className="text-[11px] text-mist-dim">{subject.name} · 1962 Archive</p>
            </div>
          </div>

          {/* Name */}
          <h2 className="mt-12 font-display text-[42px] font-medium leading-tight text-linen">
            {subject.name}
          </h2>
          <p className="mt-1 font-display text-xl italic text-mist-dim">
            {subject.birthYear} – {subject.deathYear}
          </p>

          <div className="mx-auto mt-6 h-px w-16 bg-ink-600" />

          {!hasMemories ? (
            <>
              <p className="mt-8 max-w-sm text-[15px] leading-relaxed text-mist">
                Start with the memory that comes to you first.
              </p>
              <button
                type="button"
                onClick={() => router.push('/workspace')}
                className="mt-8 flex items-center gap-2 rounded-lg bg-ember px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-ember-hover hover:shadow-soft active:translate-y-0"
              >
                <PenLine className="h-4 w-4" strokeWidth={2} />
                Add Memory
              </button>
            </>
          ) : (
            <div className="mt-8 w-full max-w-lg">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-mist-dim">
                  Recent Memories
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/workspace')}
                  className="text-xs font-medium text-ember transition hover:text-ember-hover"
                >
                  View all →
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {recentMemories.map((memory) => (
                  <RecentMemoryRow key={memory.id} memory={memory} />
                ))}
              </div>
              <button
                type="button"
                onClick={() => router.push('/workspace')}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-ink-600 py-3 text-sm font-medium text-mist transition hover:border-ember hover:text-linen"
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
                Add another memory
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function RecentMemoryRow({ memory }: { memory: Memory }) {
  const Icon = typeIcon[memory.type]
  return (
    <div className="flex items-start gap-3 rounded-lg border border-ink-600 bg-ink-800 px-4 py-3 transition hover:border-ink-500">
      <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ink-600 text-mist">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-linen truncate">{memory.title}</p>
        <p className="mt-0.5 text-xs text-mist-dim">
          {relativeTime(memory.createdAt)}
          {memory.location ? ` · ${memory.location}` : ''}
        </p>
      </div>
      {memory.isDraft && (
        <span className="mt-0.5 rounded-full bg-ember/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ember">
          Draft
        </span>
      )}
    </div>
  )
}
