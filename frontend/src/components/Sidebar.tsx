import { BookOpen, Calendar, Mic, Plus, Users } from 'lucide-react'
import type { Subject } from '../types'

export type WorkspaceTab = 'memories' | 'voiceNotes' | 'timeline' | 'contributors'

interface SidebarProps {
  subject: Subject
  activeTab: WorkspaceTab
  onTabChange: (tab: WorkspaceTab) => void
  onAddMemory: () => void
}

const NAV_ITEMS: { id: WorkspaceTab; label: string; icon: typeof BookOpen }[] = [
  { id: 'memories', label: 'Memories', icon: BookOpen },
  { id: 'voiceNotes', label: 'Voice Notes', icon: Mic },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'contributors', label: 'Contributors', icon: Users },
]

export default function Sidebar({ subject, activeTab, onTabChange, onAddMemory }: SidebarProps) {
  return (
    <aside className="flex h-screen w-[240px] flex-shrink-0 flex-col justify-between border-r border-ink-600 bg-ink-800 px-5 py-8">
      <div>
        <h1 className="font-display text-xl text-linen">{subject.name}</h1>
        <p className="mt-0.5 text-sm text-mist-dim">
          {subject.birthYear} – {subject.deathYear}
        </p>

        <nav className="mt-10 flex flex-col gap-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => onTabChange(id)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[15px] transition ${
                  active ? 'bg-ink-600 text-ember' : 'text-mist hover:bg-ink-700 hover:text-linen'
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {label}
              </button>
            )
          })}
        </nav>
      </div>

      <button
        type="button"
        onClick={onAddMemory}
        className="flex items-center justify-center gap-2 rounded-lg bg-ember px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-ember-hover"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        Add Memory
      </button>
    </aside>
  )
}
