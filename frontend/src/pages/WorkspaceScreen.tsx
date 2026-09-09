import { useEffect, useState } from 'react'
import { Sparkles, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BackButton from '../components/BackButton'
import Sidebar, { type WorkspaceTab } from '../components/Sidebar'
import MemoryRow from '../components/MemoryRow'
import MemoryComposer from '../components/MemoryComposer'
import { useMemories } from '../context/MemoryContext'
import { useSubject } from '../data/subject'
import { useHeirloomData } from '../data/heirloom'
import type { Memory } from '../types'
import { groupByDay } from '../utils/format'

export default function WorkspaceScreen() {
  const navState = null

  const { memories, addMemory, updateMemory } = useMemories()
  const subject = useSubject()
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('memories')

  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [composerAutoRecord, setComposerAutoRecord] = useState(false)
  const [composerInitialBody, setComposerInitialBody] = useState('')
  const [activeDraft, setActiveDraft] = useState<Memory | null>(null)

  // Arrived here from the Guide screen with a prefill or an "auto-record" request.
  useEffect(() => {
    if (!navState) return
    setActiveDraft(null)
    setComposerAutoRecord(Boolean(navState.autoRecord))
    setComposerInitialBody(navState.prefillBody ?? '')
    setIsComposerOpen(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openNewMemory = () => {
    setActiveDraft(null)
    setComposerAutoRecord(false)
    setComposerInitialBody('')
    setIsComposerOpen(true)
  }

  const openDraft = (memory: Memory) => {
    setActiveDraft(memory)
    setComposerAutoRecord(false)
    setComposerInitialBody('')
    setIsComposerOpen(true)
  }

  const handleSave = (memory: Memory) => {
    const exists = memories.some((m) => m.id === memory.id)
    if (exists) updateMemory(memory)
    else addMemory(memory)
    setIsComposerOpen(false)
  }

  const draftMemory = memories.find((m) => m.isDraft)
  const voiceMemories = memories.filter((m) => m.type === 'voice')
  const dayGroups = groupByDay(memories)

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar subject={subject} activeTab={activeTab} onTabChange={setActiveTab} onAddMemory={openNewMemory} />

      <main className="flex-1 overflow-y-auto px-10 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <BackButton to="/dashboard" />
          </div>
          {draftMemory && (
            <button
              type="button"
              onClick={() => openDraft(draftMemory)}
              className="mb-8 flex w-full items-center justify-between rounded-lg border border-terracotta/30 bg-terracotta/10 px-5 py-3.5 text-left transition hover:bg-terracotta/15"
            >
              <span className="text-sm text-charcoal">
                Continue where you left off — <span className="italic text-charcoal/60">{draftMemory.title}</span>
              </span>
              <span className="text-sm font-medium text-terracotta">Continue →</span>
            </button>
          )}

          {activeTab === 'memories' && <MemoriesTab memories={memories} onEmptyAction={openNewMemory} />}
          {activeTab === 'voiceNotes' && <VoiceNotesTab memories={voiceMemories} onEmptyAction={openNewMemory} />}
          {activeTab === 'timeline' && <TimelineTab dayGroups={dayGroups} onEmptyAction={openNewMemory} />}
          {activeTab === 'contributors' && <ContributorsTab />}
        </div>
      </main>

      <MemoryComposer
        isOpen={isComposerOpen}
        draft={activeDraft}
        initialBody={composerInitialBody}
        autoRecord={composerAutoRecord}
        onClose={() => setIsComposerOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}

function SectionHeading({ title, count }: { title: string; count: number }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="font-display text-2xl text-charcoal">{title}</h2>
      <span className="text-sm text-charcoal/50">
        {count} {count === 1 ? 'item' : 'items'}
      </span>
    </div>
  )
}

function EmptyRow({ label, onAction }: { label: string; onAction: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-charcoal/20 py-14 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream">
        <Sparkles className="h-4 w-4 text-terracotta" strokeWidth={1.75} />
      </span>
      <p className="mt-4 text-sm text-charcoal/60">{label}</p>
      <button
        type="button"
        onClick={onAction}
        className="mt-4 rounded-lg bg-terracotta px-5 py-2 text-sm font-medium text-cream transition hover:bg-terracotta-dark"
      >
        Add a memory
      </button>
    </div>
  )
}

function MemoriesTab({ memories, onEmptyAction }: { memories: Memory[]; onEmptyAction: () => void }) {
  return (
    <div>
      <SectionHeading title="Memories" count={memories.length} />
      {memories.length === 0 ? (
        <EmptyRow label="Your first memory is waiting." onAction={onEmptyAction} />
      ) : (
        memories.map((memory) => <MemoryRow key={memory.id} memory={memory} />)
      )}
    </div>
  )
}

function VoiceNotesTab({ memories, onEmptyAction }: { memories: Memory[]; onEmptyAction: () => void }) {
  return (
    <div>
      <SectionHeading title="Voice Notes" count={memories.length} />
      {memories.length === 0 ? (
        <EmptyRow label="No voice notes yet — record the first one." onAction={onEmptyAction} />
      ) : (
        memories.map((memory) => <MemoryRow key={memory.id} memory={memory} />)
      )}
    </div>
  )
}

function TimelineTab({
  dayGroups,
  onEmptyAction,
}: {
  dayGroups: Array<[string, Memory[]]>
  onEmptyAction: () => void
}) {
  return (
    <div>
      <SectionHeading title="Timeline" count={dayGroups.reduce((sum, [, items]) => sum + items.length, 0)} />
      {dayGroups.length === 0 ? (
        <EmptyRow label="Nothing on the timeline yet." onAction={onEmptyAction} />
      ) : (
        dayGroups.map(([label, items]) => (
          <div key={label} className="mb-8">
            <div className="mb-3 flex items-center gap-4">
              <span className="whitespace-nowrap text-sm font-medium uppercase tracking-[0.1em] text-charcoal/40">
                {label}
              </span>
              <span className="h-px flex-1 bg-charcoal/15" />
            </div>
            {items.map((memory) => (
              <MemoryRow key={memory.id} memory={memory} />
            ))}
          </div>
        ))
      )}
    </div>
  )
}

function ContributorsTab() {
  const router = useRouter()
  const { memoirMeta } = useHeirloomData()

  return (
    <div>
      <SectionHeading title="Contributors" count={0} />
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-charcoal/15 bg-white px-8 py-14 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
          <UserPlus className="h-6 w-6" strokeWidth={1.75} />
        </span>
        <p className="mt-1 font-display text-xl text-charcoal">
          Invite your family and friends to build memories together
        </p>
        <p className="max-w-sm text-sm leading-relaxed text-charcoal/60">
          Share this memoir&apos;s link and anyone you invite can add their own stories, photos, and reflections.
        </p>
        <button
          type="button"
          onClick={() => router.push(`/m/${memoirMeta.slug}/manage`)}
          className="mt-3 flex items-center gap-2 rounded-lg bg-terracotta px-6 py-2.5 text-sm font-semibold text-cream shadow-sm transition hover:bg-terracotta-dark"
        >
          <UserPlus className="h-4 w-4" strokeWidth={2} />
          Invite Family &amp; Friends
        </button>
      </div>
    </div>
  )
}
