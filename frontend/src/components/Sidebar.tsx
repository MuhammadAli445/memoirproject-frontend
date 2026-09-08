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
    <aside className="flex h-screen w-[240px] flex-shrink-0 flex-col justify-between border-r border-charcoal/10 bg-white px-5 py-8">
      <div>
        <h1 className="font-display text-xl text-charcoal">{subject.name}</h1>
        {subject.birthYear && (
          <p className="mt-0.5 text-sm text-charcoal/50">
            {subject.birthYear} – {subject.deathYear ?? 'Present'}
          </p>
        )}

        <nav className="mt-10 flex flex-col gap-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => onTabChange(id)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[15px] transition ${
                  active ? 'bg-cream text-terracotta' : 'text-charcoal/60 hover:bg-cream hover:text-charcoal'
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
        className="flex items-center justify-center gap-2 rounded-lg bg-terracotta px-4 py-3 text-sm font-semibold text-cream shadow-sm transition hover:bg-terracotta-dark"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        Add Memory
      </button>
    </aside>
  )
}
