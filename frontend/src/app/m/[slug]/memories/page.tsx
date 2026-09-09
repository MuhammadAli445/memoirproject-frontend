'use client'

import { use, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  Camera,
  Check,
  Heart,
  Home,
  Link2,
  Mail,
  MessageSquare,
  PlusCircle,
  Share2,
  Timeline,
  Verified,
  X,
} from 'lucide-react'
import { useHeirloomData, type FamilyMemory } from '@/data/heirloom'
import { HeirloomToast, useHeirloomToast } from '@/components/heirloom/HeirloomToast'

function initialsOf(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'FM'
  )
}

type Filter = 'all' | 'photos' | 'stories'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 24)
}

export default function FamilyMemoriesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { toast, showToast, hideToast } = useHeirloomToast()
  const { memoirMeta, familyMemories } = useHeirloomData()

  const [memories, setMemories] = useState<FamilyMemory[]>(familyMemories)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<Filter>('all')

  const [shareTarget, setShareTarget] = useState<FamilyMemory | null>(null)
  const [copiedShare, setCopiedShare] = useState(false)

  const [contributeOpen, setContributeOpen] = useState(false)
  const [form, setForm] = useState({ name: '', relation: '', title: '', story: '' })

  const counts = useMemo(
    () => ({
      all: memories.length,
      photos: memories.filter((m) => Boolean(m.image)).length,
      stories: memories.filter((m) => !m.image).length,
    }),
    [memories],
  )

  const filtered = useMemo(() => {
    if (filter === 'all') return memories
    if (filter === 'photos') return memories.filter((m) => Boolean(m.image))
    return memories.filter((m) => !m.image)
  }, [memories, filter])

  function toggleLike(id: string) {
    setLikedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, likes: m.likes + (likedIds.has(id) ? -1 : 1) } : m)),
    )
  }

  function openShare(memory: FamilyMemory) {
    setCopiedShare(false)
    setShareTarget(memory)
  }

  function copyShareLink() {
    if (!shareTarget) return
    const url = `memoir.project/harrison#${slugify(shareTarget.title)}`
    navigator.clipboard?.writeText(url).catch(() => {})
    setCopiedShare(true)
    setTimeout(() => setCopiedShare(false), 1800)
  }

  function submitContribution() {
    if (!form.name.trim() || !form.title.trim() || !form.story.trim()) return
    const newMemory: FamilyMemory = {
      id: `fm-${Date.now()}`,
      author: form.name.trim(),
      relation: form.relation.trim() || 'Family Contributor',
      initials: initialsOf(form.name.trim()),
      date: 'Just now',
      postedLabel: 'Posted moments ago',
      era: 'Era: New Contribution',
      title: form.title.trim(),
      quote: form.story.trim(),
      likes: 0,
    }
    setMemories((prev) => [newMemory, ...prev])
    setContributeOpen(false)
    setForm({ name: '', relation: '', title: '', story: '' })
    showToast('Your memory has been added to the family ledger')
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-heirloom-bg-page font-heirloom-sans text-heirloom-text-primary antialiased">
      <header className="sticky top-0 z-40 w-full border-b border-heirloom-border bg-heirloom-bg-page/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1720px] items-center justify-between px-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <BookOpen className="h-6 w-6 text-heirloom-primary" strokeWidth={1.75} />
              <Link href={`/m/${slug}`} className="font-heirloom-serif text-xl tracking-tight text-heirloom-text-primary transition-colors hover:text-heirloom-primary">
                The Memoir Project
              </Link>
            </div>
            <div className="h-4 w-px bg-heirloom-border" />
            <Link
              href={`/m/${slug}`}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-heirloom-text-secondary transition-colors hover:text-heirloom-primary"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" strokeWidth={2} />
              <span>
                Back to Memoir <strong className="font-semibold text-heirloom-text-primary">({memoirMeta.title})</strong>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-heirloom-mono text-sm text-heirloom-text-tertiary">
              Archive Code: {memoirMeta.archiveCode}
            </span>
            <div className="flex items-center gap-2 rounded-full border border-heirloom-border bg-heirloom-bg-card-alt px-3 py-1 text-sm font-medium text-heirloom-text-secondary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-heirloom-success" />
              <span>
                Public Family Chronicle • {memoirMeta.subtitle}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setContributeOpen(true)}
              className="flex h-9 items-center gap-1.5 rounded-full bg-heirloom-primary px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-heirloom-primary-hover active:scale-[0.98]"
            >
              <PlusCircle className="h-4 w-4" strokeWidth={2} />
              <span>Contribute a Memory</span>
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-heirloom-border px-3.5 py-1.5 text-sm font-semibold text-heirloom-text-secondary transition-colors hover:border-heirloom-primary/40 hover:text-heirloom-primary"
            >
              <Home className="h-4 w-4" strokeWidth={2} />
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="flex w-full flex-grow flex-col justify-between overflow-hidden px-8 py-4">
        <div className="mx-auto flex h-full w-full max-w-[1720px] flex-col">
          <div className="mb-4 flex shrink-0 items-center justify-between gap-6 border-b border-heirloom-border pb-3">
            <div>
              <div className="mb-0.5 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-heirloom-primary">
                <BookOpen className="h-3.5 w-3.5" strokeWidth={2} />
                <span>Living Family Ledger</span>
              </div>
              <div className="flex items-baseline gap-3">
                <h1 className="font-heirloom-serif text-2xl tracking-tight text-heirloom-text-primary">
                  Family Memories &amp; Reflections
                </h1>
                <p className="hidden text-sm text-heirloom-text-secondary xl:inline">
                  A living chronicle of cherished stories and personal recollections of {memoirMeta.title.replace(/^The Story of\s*/i, '')}.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <div className="flex items-center gap-1.5">
                {(
                  [
                    { key: 'all' as const, label: 'All Memories', count: counts.all, icon: null },
                    { key: 'photos' as const, label: 'Photos & Keepsakes', count: counts.photos, icon: Camera },
                    { key: 'stories' as const, label: 'Stories', count: counts.stories, icon: BookOpen },
                  ]
                ).map((chip) => {
                  const Icon = chip.icon
                  const active = filter === chip.key
                  return (
                    <button
                      key={chip.key}
                      type="button"
                      onClick={() => setFilter(chip.key)}
                      className={`flex h-7 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-colors ${
                        active
                          ? 'bg-heirloom-primary text-white shadow-sm'
                          : 'border border-heirloom-border bg-heirloom-bg-card text-heirloom-text-secondary hover:border-heirloom-primary/40 hover:text-heirloom-text-primary'
                      }`}
                    >
                      {Icon && <Icon className="h-3 w-3" strokeWidth={2} />}
                      <span>{chip.label}</span>
                      <span className={active ? 'rounded-full bg-white/25 px-1.5 py-0.5 text-sm' : 'text-heirloom-text-tertiary'}>
                        {chip.count}
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="h-4 w-px bg-heirloom-border" />
              <div className="inline-flex items-center gap-1.5 rounded-full border border-heirloom-border bg-heirloom-bg-card-alt px-3 py-1 text-sm font-medium text-heirloom-text-secondary">
                <Timeline className="h-3 w-3 text-heirloom-primary" strokeWidth={2} />
                <span>Chronological Timeline • 1968 – Present</span>
              </div>
            </div>
          </div>

          <div className="grid flex-grow grid-cols-1 gap-4 overflow-y-auto pb-1 pr-1 lg:grid-cols-2">
            {filtered.map((memory) => (
              <article
                key={memory.id}
                className="flex flex-col justify-between rounded-xl border border-heirloom-border bg-heirloom-bg-card p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-2.5 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-heirloom-primary/20 bg-heirloom-primary/10 text-sm font-semibold text-heirloom-primary">
                      {memory.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-heirloom-text-primary">{memory.author}</span>
                        <span className="rounded-full border border-heirloom-border bg-heirloom-bg-card-alt px-2 py-0.5 text-sm font-semibold text-heirloom-primary">
                          {memory.relation}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-heirloom-text-tertiary">
                        <span>{memory.date} • {memory.postedLabel}</span>
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full border border-heirloom-border bg-heirloom-bg-card-alt px-2.5 py-0.5 text-sm font-medium text-heirloom-text-secondary">
                    <span className="h-1.5 w-1.5 rounded-full bg-heirloom-gold-accent" />
                    <span>{memory.era}</span>
                  </div>
                </div>

                <h2 className="mb-2 font-heirloom-serif text-lg text-heirloom-text-primary">{memory.title}</h2>

                <div className="mb-3 rounded-lg border border-heirloom-border/80 bg-heirloom-bg-card-alt p-3.5">
                  <p className="mb-3 font-heirloom-serif text-sm italic leading-relaxed text-heirloom-text-primary">
                    &ldquo;{memory.quote}&rdquo;
                  </p>
                  {memory.image && (
                    <div className="flex items-center gap-3 rounded-md border border-heirloom-border bg-heirloom-bg-card p-2 shadow-sm">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded border border-heirloom-border bg-gradient-to-br from-[#e9dcc8] via-[#d9c19f] to-[#a9835a] text-heirloom-bg-card/70">
                        <Camera className="h-6 w-6" strokeWidth={1.25} />
                      </div>
                      <div className="pr-2">
                        <span className="block text-sm font-semibold text-heirloom-text-primary">{memory.image.caption}</span>
                        <span className="block font-heirloom-mono text-sm text-heirloom-text-tertiary">{memory.image.meta}</span>
                        <span className="mt-0.5 inline-flex items-center gap-1 text-sm font-medium text-heirloom-primary">
                          <Verified className="h-3 w-3" strokeWidth={2} />
                          Verified Archival Artifact
                        </span>
                      </div>
                    </div>
                  )}
                  {memory.footnote && (
                    <div className="mt-2.5 flex items-center gap-1.5 border-t border-heirloom-border pt-2 text-sm text-heirloom-text-secondary">
                      <BookOpen className="h-3 w-3 text-heirloom-primary" strokeWidth={2} />
                      <span>{memory.footnote}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-heirloom-border pt-2 text-sm text-heirloom-text-secondary">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => toggleLike(memory.id)}
                      className="inline-flex items-center gap-1 font-medium transition-colors hover:text-heirloom-danger"
                    >
                      <Heart
                        className="h-4 w-4 text-heirloom-danger transition-transform hover:scale-110"
                        strokeWidth={2}
                        fill={likedIds.has(memory.id) ? 'currentColor' : 'none'}
                      />
                      <span className="font-semibold text-heirloom-text-primary">{memory.likes}</span>
                      <span>cherished</span>
                    </button>
                    {memory.noteCount ? (
                      <span className="inline-flex items-center gap-1 font-medium">
                        <MessageSquare className="h-4 w-4" strokeWidth={2} />
                        <span>{memory.noteCount} family note{memory.noteCount > 1 ? 's' : ''}</span>
                      </span>
                    ) : memory.featured ? (
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-heirloom-success">
                        <BookOpen className="h-3.5 w-3.5" strokeWidth={2} />
                        {memory.featured}
                      </span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => openShare(memory)}
                    className="flex h-7 items-center gap-1 rounded-full border border-heirloom-primary/30 bg-heirloom-bg-card-alt px-3 text-sm font-semibold text-heirloom-primary shadow-sm transition-all hover:border-heirloom-primary hover:bg-heirloom-primary/10 active:scale-95"
                  >
                    <Share2 className="h-3 w-3" strokeWidth={2} />
                    <span>Share Memory</span>
                  </button>
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-heirloom-border bg-heirloom-bg-card-alt px-8 py-16 text-center">
                <PlusCircle className="h-8 w-8 text-heirloom-primary/60" strokeWidth={1.5} />
                <p className="font-heirloom-serif text-xl text-heirloom-text-primary">
                  Invite your family and friends to build memories together
                </p>
                <p className="max-w-sm text-sm leading-relaxed text-heirloom-text-secondary">
                  Every story, photo, or voice recording someone shares adds another page to this memoir.
                </p>
                <button
                  type="button"
                  onClick={() => setContributeOpen(true)}
                  className="mt-2 flex items-center gap-1.5 rounded-full bg-heirloom-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-heirloom-primary-hover"
                >
                  <PlusCircle className="h-4 w-4" strokeWidth={2} />
                  Contribute the First Memory
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="w-full shrink-0 border-t border-heirloom-border bg-heirloom-bg-card-alt py-3">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-8 text-sm text-heirloom-text-tertiary sm:flex-row">
          <p className="font-heirloom-serif text-sm italic text-heirloom-text-secondary">
            Preserving generational memories with quiet dignity.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="transition-colors hover:text-heirloom-primary">About</Link>
            <Link href="#" className="transition-colors hover:text-heirloom-primary">Privacy</Link>
            <span>© The Memoir Project</span>
          </div>
        </div>
      </footer>

      {/* Share Modal */}
      {shareTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-heirloom-border bg-heirloom-bg-card p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-heirloom-primary">
                <Share2 className="h-5 w-5" strokeWidth={1.75} />
                <h3 className="font-heirloom-serif text-xl text-heirloom-text-primary">Share Reflection</h3>
              </div>
              <button
                type="button"
                onClick={() => setShareTarget(null)}
                className="rounded-full p-2.5 text-heirloom-text-tertiary transition-colors hover:text-heirloom-text-primary"
              >
                <X className="h-[18px] w-[18px]" strokeWidth={2} />
              </button>
            </div>
            <p className="mb-5 text-sm leading-relaxed text-heirloom-text-secondary">
              Share &ldquo;{shareTarget.title}&rdquo; contributed by {shareTarget.author} with loved ones.
            </p>
            <div className="mb-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={copyShareLink}
                className="flex h-11 w-full items-center justify-between rounded-xl border border-heirloom-border bg-heirloom-bg-card-alt px-4 text-sm font-semibold text-heirloom-text-primary transition-colors hover:bg-heirloom-surface-container"
              >
                <span className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-heirloom-primary" strokeWidth={2} />
                  <span>memoir.project/harrison#{slugify(shareTarget.title)}</span>
                </span>
                <span className="flex items-center gap-1 font-heirloom-mono text-sm text-heirloom-primary">
                  {copiedShare && <Check className="h-3.5 w-3.5" strokeWidth={2} />}
                  {copiedShare ? 'Copied!' : 'Copy Link'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Email digest link prepared for family distribution list', Mail)
                  setShareTarget(null)
                }}
                className="flex h-11 w-full items-center gap-2.5 rounded-xl border border-heirloom-border bg-heirloom-bg-card px-4 text-sm font-semibold text-heirloom-text-primary transition-colors hover:bg-heirloom-bg-card-alt"
              >
                <Mail className="h-4 w-4 text-heirloom-text-secondary" strokeWidth={2} />
                <span>Send via Family Email Circle</span>
              </button>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShareTarget(null)}
                className="h-9 rounded-full bg-heirloom-surface-container px-5 text-sm font-medium text-heirloom-text-secondary transition-colors hover:text-heirloom-text-primary"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contribute Modal */}
      {contributeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-heirloom-border bg-heirloom-bg-card p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-heirloom-primary">
                <PlusCircle className="h-5 w-5" strokeWidth={1.75} />
                <h3 className="font-heirloom-serif text-xl text-heirloom-text-primary">Contribute a Memory</h3>
              </div>
              <button
                type="button"
                onClick={() => setContributeOpen(false)}
                className="rounded-full p-2.5 text-heirloom-text-tertiary transition-colors hover:text-heirloom-text-primary"
              >
                <X className="h-[18px] w-[18px]" strokeWidth={2} />
              </button>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-heirloom-text-secondary">
              Your memory joins the living family ledger for {memoirMeta.title}, visible to everyone with access to
              this archive.
            </p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold uppercase tracking-wider text-heirloom-text-primary">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g., Amina"
                    className="w-full rounded-lg border border-heirloom-border bg-heirloom-bg-card-alt px-3 py-2 text-sm text-heirloom-text-primary placeholder:text-heirloom-text-tertiary focus:outline-none focus:ring-2 focus:ring-heirloom-primary/30"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold uppercase tracking-wider text-heirloom-text-primary">
                    Relation
                  </label>
                  <input
                    type="text"
                    value={form.relation}
                    onChange={(e) => setForm((f) => ({ ...f, relation: e.target.value }))}
                    placeholder="e.g., Granddaughter"
                    className="w-full rounded-lg border border-heirloom-border bg-heirloom-bg-card-alt px-3 py-2 text-sm text-heirloom-text-primary placeholder:text-heirloom-text-tertiary focus:outline-none focus:ring-2 focus:ring-heirloom-primary/30"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold uppercase tracking-wider text-heirloom-text-primary">
                  Memory Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g., The Porch Light Ritual"
                  className="w-full rounded-lg border border-heirloom-border bg-heirloom-bg-card-alt px-3 py-2 text-sm text-heirloom-text-primary placeholder:text-heirloom-text-tertiary focus:outline-none focus:ring-2 focus:ring-heirloom-primary/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold uppercase tracking-wider text-heirloom-text-primary">
                  Your Story
                </label>
                <textarea
                  rows={3}
                  value={form.story}
                  onChange={(e) => setForm((f) => ({ ...f, story: e.target.value }))}
                  placeholder="Share what you remember..."
                  className="w-full resize-none rounded-lg border border-heirloom-border bg-heirloom-bg-card-alt px-3 py-2 text-sm text-heirloom-text-primary placeholder:text-heirloom-text-tertiary focus:outline-none focus:ring-2 focus:ring-heirloom-primary/30"
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setContributeOpen(false)}
                  className="rounded-full px-4 py-1.5 text-sm font-semibold text-heirloom-text-secondary transition-all hover:bg-heirloom-bg-card-alt"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitContribution}
                  disabled={!form.name.trim() || !form.title.trim() || !form.story.trim()}
                  className="flex items-center gap-1.5 rounded-full bg-heirloom-primary px-5 py-1.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-heirloom-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <PlusCircle className="h-[14px] w-[14px]" strokeWidth={2} />
                  <span>Add to Ledger</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <HeirloomToast toast={toast} onDismiss={hideToast} />
    </div>
  )
}
