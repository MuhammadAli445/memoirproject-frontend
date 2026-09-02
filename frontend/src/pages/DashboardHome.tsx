import { BookOpen, Calendar, Camera, FileText, ImageOff, LogOut, Mic, PenLine, Plus, Sparkles, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BackButton from '../components/BackButton'
import { useMemories } from '../context/MemoryContext'
import { useAuth } from '../context/AuthContext'
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
  const { user, logout } = useAuth()

  const recentMemories = memories.slice(0, 3)
  const hasMemories = memories.length > 0

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar */}
      <aside className="flex h-screen w-[260px] flex-shrink-0 flex-col justify-between border-r border-charcoal/10 bg-white px-6 py-8">
        <div>
          <p className="text-sm text-charcoal/50">The Memoir Project</p>

          <div className="mt-10">
            <h1 className="font-display text-[22px] font-medium text-charcoal">{subject.name}</h1>
            <p className="mt-0.5 text-sm text-charcoal/50">
              {subject.birthYear} – {subject.deathYear}
            </p>
          </div>

          <nav className="mt-10 flex flex-col gap-1">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => router.push('/workspace', { state: { tab: id } })}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[15px] text-charcoal/70 transition hover:bg-cream hover:text-charcoal"
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => router.push('/book')}
            className="flex items-center justify-center gap-2 rounded-lg border border-terracotta/30 px-4 py-3 text-sm font-semibold text-terracotta transition hover:bg-terracotta/10"
          >
            <Sparkles className="h-4 w-4" strokeWidth={2} />
            Preview Memoir
          </button>
          <button
            type="button"
            onClick={() => router.push('/workspace')}
            className="flex items-center justify-center gap-2 rounded-lg bg-terracotta px-4 py-3 text-sm font-semibold text-cream shadow-sm transition hover:bg-terracotta-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add Memory
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center px-10 py-10">
        <div className="absolute left-72 top-8">
          <BackButton to="/" />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center animate-fadeIn">
          {/* Framed portrait */}
          <div className="relative">
            <div className="rounded-xl border-[6px] border-charcoal/15 bg-white shadow-card">
              <div className="h-[300px] w-[240px] overflow-hidden rounded-lg bg-cream">
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-cream to-white">
                  <ImageOff className="h-12 w-12 text-charcoal/30" strokeWidth={1.2} />
                </div>
              </div>
            </div>
            {/* Caption plate */}
            <div className="absolute -bottom-4 left-1/2 w-[85%] -translate-x-1/2 rounded-lg bg-white px-3 py-1.5 text-center shadow-sm">
              <p className="text-[11px] text-charcoal/50">{subject.name} · 1962 Archive</p>
            </div>
          </div>

          {/* Name */}
          <h2 className="mt-12 font-display text-[42px] font-medium leading-tight text-charcoal">
            {subject.name}
          </h2>
          <p className="mt-1 font-display text-xl italic text-charcoal/50">
            {subject.birthYear} – {subject.deathYear}
          </p>

          <div className="mx-auto mt-6 h-px w-16 bg-charcoal/15" />

          {!hasMemories ? (
            <>
              <p className="mt-8 max-w-sm text-[15px] leading-relaxed text-charcoal/60">
                Start with the memory that comes to you first.
              </p>
              <button
                type="button"
                onClick={() => router.push('/workspace')}
                className="mt-8 flex items-center gap-2 rounded-lg bg-terracotta px-8 py-3.5 text-sm font-semibold text-cream shadow-sm transition hover:-translate-y-0.5 hover:bg-terracotta-dark hover:shadow-soft active:translate-y-0"
              >
                <PenLine className="h-4 w-4" strokeWidth={2} />
                Add Memory
              </button>
            </>
          ) : (
            <div className="mt-8 w-full max-w-lg">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-charcoal/40">
                  Recent Memories
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/workspace')}
                  className="text-xs font-medium text-terracotta transition hover:text-terracotta-dark"
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
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-charcoal/15 py-3 text-sm font-medium text-charcoal/60 transition hover:border-terracotta hover:text-charcoal"
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
    <div className="flex items-start gap-3 rounded-lg border border-charcoal/10 bg-white px-4 py-3 transition hover:border-charcoal/20">
      <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-cream text-charcoal/50">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-charcoal truncate">{memory.title}</p>
        <p className="mt-0.5 text-xs text-charcoal/40">
          {relativeTime(memory.createdAt)}
          {memory.location ? ` · ${memory.location}` : ''}
        </p>
      </div>
      {memory.isDraft && (
        <span className="mt-0.5 rounded-full bg-terracotta/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-terracotta">
          Draft
        </span>
      )}
    </div>
  )
}
