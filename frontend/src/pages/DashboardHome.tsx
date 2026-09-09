import { BookOpen, Calendar, Camera, Feather, FileText, ImageOff, LogOut, Mic, PenLine, Plus, Share2, Sparkles, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BackButton from '../components/BackButton'
import { useMemories } from '../context/MemoryContext'
import { useAuth } from '../context/AuthContext'
import { useSubject, DEFAULT_SUBJECT } from '../data/subject'
import { useHeirloomData } from '../data/heirloom'
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
  const subject = useSubject()
  const { memoirMeta } = useHeirloomData()

  const recentMemories = memories.slice(0, 3)
  const hasMemories = memories.length > 0
  const honoreeName = subject.name !== DEFAULT_SUBJECT.name ? subject.name : null

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar */}
      <aside className="flex h-screen w-[260px] flex-shrink-0 flex-col justify-between border-r border-charcoal/10 bg-white px-6 py-8">
        <div>
          <p className="text-sm text-charcoal/50">The Memoir Project</p>

          <div className="mt-10">
            <h1 className="font-display text-[22px] font-medium text-charcoal">{subject.name}</h1>
            {subject.birthYear && (
              <p className="mt-0.5 text-sm text-charcoal/50">
                {subject.birthYear} – {subject.deathYear ?? 'Present'}
              </p>
            )}
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
            onClick={() => router.push(`/m/${memoirMeta.slug}/manage`)}
            className="flex items-center justify-center gap-2 rounded-lg border border-charcoal/15 px-4 py-3 text-sm font-semibold text-charcoal/70 transition hover:border-terracotta/30 hover:text-terracotta"
          >
            <Share2 className="h-4 w-4" strokeWidth={2} />
            Manage Sharing
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
              <p className="text-sm text-charcoal/50">{subject.name} · Family Archive</p>
            </div>
          </div>

          {/* Name */}
          <h2 className="mt-12 font-display text-[42px] font-medium leading-tight text-charcoal">
            {subject.name}
          </h2>
          {subject.birthYear && (
            <p className="mt-1 font-display text-xl italic text-charcoal/50">
              {subject.birthYear} – {subject.deathYear ?? 'Present'}
            </p>
          )}

          <div className="mx-auto mt-6 h-px w-16 bg-charcoal/15" />

          {!hasMemories ? (
            <div className="mt-8 flex w-full max-w-md flex-col items-center rounded-2xl border border-terracotta/15 bg-gradient-to-b from-white to-cream/70 px-8 py-10 text-center shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
                <Feather className="h-6 w-6" strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 font-display text-2xl font-medium text-charcoal">
                Your first memory is waiting
              </h3>
              <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-charcoal/60">
                {honoreeName
                  ? `Every story you add becomes a page in ${honoreeName}'s memoir. There's no wrong place to start — just begin with whatever comes to mind.`
                  : "Every story you add becomes a page in this memoir. There's no wrong place to start — just begin with whatever comes to mind."}
              </p>
              <button
                type="button"
                onClick={() => router.push('/workspace')}
                className="mt-7 flex items-center gap-2 rounded-lg bg-terracotta px-8 py-3.5 text-sm font-semibold text-cream shadow-sm transition hover:-translate-y-0.5 hover:bg-terracotta-dark hover:shadow-soft active:translate-y-0"
              >
                <PenLine className="h-4 w-4" strokeWidth={2} />
                Add Your First Memory
              </button>
            </div>
          ) : (
            <div className="mt-8 w-full max-w-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium uppercase tracking-[0.14em] text-charcoal/40">
                  Recent Memories
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/workspace')}
                  className="text-sm font-medium text-terracotta transition hover:text-terracotta-dark"
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
        <p className="mt-0.5 text-sm text-charcoal/40">
          {relativeTime(memory.createdAt)}
          {memory.location ? ` · ${memory.location}` : ''}
        </p>
      </div>
      {memory.isDraft && (
        <span className="mt-0.5 rounded-full bg-terracotta/15 px-2 py-0.5 text-sm font-semibold uppercase tracking-wide text-terracotta">
          Draft
        </span>
      )}
    </div>
  )
}
