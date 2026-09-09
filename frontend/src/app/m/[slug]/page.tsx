'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  Camera,
  Clock,
  Feather,
  Flower2,
  Gem,
  Heart,
  Home,
  MessageCircle,
  PenLine,
  Reply,
  Search,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  User,
  X,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useHeirloomData, type Reflection } from '@/data/heirloom'
import { useHeirloomToast, HeirloomToast } from '@/components/heirloom/HeirloomToast'

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

export default function PublicMemoirViewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const { memoirMeta, chapterOne, initialReflections } = useHeirloomData()
  const { user } = useAuth()
  const { toast, showToast, hideToast } = useHeirloomToast()

  const [suggestOpen, setSuggestOpen] = useState(false)
  const [suggestName, setSuggestName] = useState('')
  const [suggestText, setSuggestText] = useState('')
  const [suggestSubmitted, setSuggestSubmitted] = useState(false)

  const [reflections, setReflections] = useState<Reflection[]>(initialReflections)
  const [reflectionInput, setReflectionInput] = useState('')
  const [reflectionAuthor, setReflectionAuthor] = useState('')
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())

  function handleCopyLink() {
    navigator.clipboard?.writeText(memoirMeta.publicUrl).catch(() => {})
    showToast('Memoir invitation link copied to clipboard')
  }

  function submitSuggestion() {
    if (!suggestText.trim()) return
    setSuggestSubmitted(true)
    setTimeout(() => {
      setSuggestOpen(false)
      setSuggestSubmitted(false)
      setSuggestName('')
      setSuggestText('')
    }, 2200)
  }

  function toggleLike(id: string) {
    setLikedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setReflections((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: r.likes + (likedIds.has(id) ? -1 : 1) } : r)),
    )
  }

  function postReflection() {
    const text = reflectionInput.trim()
    if (!text) return
    const author = reflectionAuthor.trim() || 'Cousin or Relative'
    const newReflection: Reflection = {
      id: `r-${Date.now()}`,
      author,
      relation: 'Just now',
      timeAgo: 'A moment ago',
      body: text,
      likes: 0,
    }
    setReflections((prev) => [newReflection, ...prev])
    setReflectionInput('')
    setReflectionAuthor('')
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-heirloom-bg-page font-heirloom-sans text-heirloom-text-primary antialiased">
      {/* Top Bar */}
      <header className="z-40 flex h-16 w-full shrink-0 items-center border-b border-heirloom-border/70 bg-heirloom-bg-page/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1840px] items-center justify-between px-8">
          <Link href={`/m/${slug}`} className="group flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-heirloom-primary-light text-heirloom-primary transition-all duration-300 group-hover:bg-heirloom-primary group-hover:text-heirloom-on-primary">
              <BookOpen className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </span>
            <span className="font-heirloom-serif text-2xl font-normal tracking-tight text-heirloom-text-primary transition-colors group-hover:text-heirloom-primary">
              The Memoir Project
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 rounded-full border border-heirloom-border/70 bg-heirloom-surface-container-low/80 px-4 py-1 text-sm text-heirloom-text-secondary shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              <span className="text-sm font-semibold uppercase tracking-wider text-heirloom-text-secondary">
                Public Heirloom Edition
              </span>
              <span className="text-heirloom-text-tertiary">•</span>
              <span className="font-heirloom-serif text-base italic text-heirloom-text-primary">
                {memoirMeta.volume}: {memoirMeta.title}
              </span>
            </div>
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

      <div className="mx-auto flex w-full max-w-[1840px] flex-1 flex-col gap-3.5 overflow-hidden px-8 py-4">
        {/* Actions Ribbon */}
        <div className="flex shrink-0 items-center justify-between gap-4 rounded-xl border border-heirloom-border/80 bg-heirloom-bg-card px-6 py-2.5 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-heirloom-primary-light text-heirloom-primary">
              <BookOpen className="h-[19px] w-[19px]" strokeWidth={1.75} />
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-sm font-bold uppercase tracking-wider text-heirloom-primary">
                Shared Family Memoir
              </span>
              <span className="text-sm text-heirloom-text-tertiary">•</span>
              <span className="text-sm font-medium text-heirloom-text-secondary">EST. {memoirMeta.establishedYear}</span>
              <span className="text-sm text-heirloom-text-tertiary">•</span>
              <span className="text-sm font-medium text-heirloom-text-secondary">Chapter 1 of {memoirMeta.chapterCount}</span>
              <span className="text-sm text-heirloom-text-tertiary">•</span>
              <span className="text-sm font-semibold tracking-tight text-heirloom-text-primary">
                {memoirMeta.title} • {memoirMeta.subtitle}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => router.push(`/m/${slug}/search`)}
              className="flex items-center gap-1.5 rounded-full bg-heirloom-surface-container-low px-3.5 py-1.5 text-sm font-semibold text-heirloom-text-secondary transition-all hover:bg-heirloom-surface-container hover:text-heirloom-text-primary"
            >
              <Search className="h-[15px] w-[15px]" strokeWidth={2} />
              <span>Search Memoir</span>
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 rounded-full bg-heirloom-surface-container-low px-3.5 py-1.5 text-sm font-semibold text-heirloom-text-secondary transition-all hover:bg-heirloom-surface-container hover:text-heirloom-text-primary"
            >
              <Share2 className="h-[15px] w-[15px]" strokeWidth={2} />
              <span>Copy Link</span>
            </button>
            <Link
              href={`/m/${slug}/memories`}
              className="flex items-center gap-1.5 rounded-full bg-heirloom-primary-light px-3.5 py-1.5 text-sm font-semibold text-heirloom-primary shadow-sm transition-all hover:bg-heirloom-primary hover:text-heirloom-on-primary"
            >
              <MessageCircle className="h-[15px] w-[15px]" strokeWidth={2} />
              <span>Reflections ({reflections.length})</span>
            </Link>
            {user && (
              <Link
                href={`/m/${slug}/manage`}
                title="Manage Memoir Access & Privacy"
                className="flex items-center gap-1.5 rounded-full border border-heirloom-border px-3 py-1.5 text-sm font-semibold text-heirloom-text-secondary transition-all hover:border-heirloom-primary/40 hover:text-heirloom-primary"
              >
                <Settings className="h-[15px] w-[15px]" strokeWidth={2} />
                <span>Manage Access</span>
              </Link>
            )}
          </div>
        </div>

        {/* Split Stage */}
        <div className="grid flex-1 grid-cols-12 items-stretch gap-6 overflow-hidden">
          {/* Manuscript */}
          <article className="relative col-span-12 flex h-full flex-col overflow-hidden rounded-2xl border border-heirloom-border/80 bg-gradient-to-b from-heirloom-bg-card-alt via-heirloom-bg-card to-heirloom-bg-card shadow-[0_4px_24px_rgba(40,30,20,0.04)] lg:col-span-8">
            <div className="relative flex-1 overflow-y-auto px-10 py-8 xl:px-14">
              {/* Ambient color wash behind the chapter header, echoing the chapter's own palette */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 top-0 z-0 h-[440px] bg-gradient-to-b opacity-25 blur-3xl ${chapterOne.bgClassName}`}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[280px] bg-gradient-to-b from-heirloom-primary/10 via-heirloom-gold-accent/10 to-transparent"
              />

              <header className="relative mb-8 flex flex-col items-center text-center">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-heirloom-gold-accent/20 bg-heirloom-surface-container-low text-heirloom-gold-accent">
                  <Flower2 className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <p className="mb-1.5 text-sm font-bold uppercase tracking-[0.25em] text-heirloom-primary">
                  {memoirMeta.title} • {memoirMeta.volume}
                </p>
                <h1 className="mb-3 max-w-[700px] font-heirloom-serif text-3xl leading-tight tracking-tight text-heirloom-text-primary xl:text-4xl">
                  {chapterOne.title}
                </h1>
                <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-heirloom-text-secondary">
                  <span>Dedicated to {chapterOne.dedicatedTo}</span>
                  <span className="text-heirloom-text-tertiary">•</span>
                  <span>Curated by {chapterOne.curatedBy}</span>
                  <span className="text-heirloom-text-tertiary">•</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-[14px] w-[14px] text-heirloom-primary" strokeWidth={2} />
                    {chapterOne.readTime}
                  </span>
                </div>
                <div className="flex w-48 items-center justify-center gap-3 text-heirloom-gold-accent">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-heirloom-gold-accent/60" />
                  <Gem className="h-4 w-4" strokeWidth={2} />
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-heirloom-gold-accent/60" />
                </div>
              </header>

              <section className="relative mx-auto max-w-[740px] space-y-5 font-heirloom-sans text-[15.5px] leading-[1.8] text-[#242424]">
                <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-heirloom-serif first-letter:text-5xl first-letter:leading-none first-letter:text-heirloom-primary">
                  {chapterOne.paragraphs[0]}
                </p>
                <p>{chapterOne.paragraphs[1]}</p>

                <figure className="group my-6 rounded-xl border border-heirloom-border/70 bg-heirloom-bg-card-alt p-4 shadow-sm">
                  <div className="relative aspect-[16/9] max-h-[320px] overflow-hidden rounded-lg bg-gradient-to-br from-[#e9dcc8] via-[#d9c19f] to-[#a9835a]">
                    <div className="absolute inset-0 flex items-center justify-center text-heirloom-bg-card/70">
                      <Camera className="h-10 w-10" strokeWidth={1.25} />
                    </div>
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-heirloom-inverse-surface/85 px-3 py-1 text-sm font-medium tracking-wide text-heirloom-inverse-on-surface shadow-sm backdrop-blur-sm">
                      <Camera className="h-4 w-4" strokeWidth={2} />
                      <span>Archival Plate 04</span>
                    </div>
                  </div>
                  <figcaption className="mt-2.5 flex flex-wrap items-center justify-center gap-2 text-center text-sm italic text-heirloom-text-secondary">
                    <span>{chapterOne.photoCaption}</span>
                    <span className="text-heirloom-text-tertiary">•</span>
                    <span className="text-heirloom-text-tertiary">{chapterOne.photoCredit}</span>
                  </figcaption>
                </figure>

                <p>{chapterOne.closingParagraphs[0]}</p>

                <div className="relative my-6 rounded-xl border border-heirloom-border/70 bg-heirloom-surface-container-low p-5 transition-all duration-300 hover:shadow-sm">
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-heirloom-primary" />
                      <span className="text-sm font-bold uppercase tracking-widest text-heirloom-primary">
                        Living Memory Passage
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSuggestOpen(true)}
                      className="flex items-center gap-1 rounded-full bg-heirloom-primary-light px-2.5 py-1 text-sm font-semibold text-heirloom-primary transition-all hover:bg-heirloom-primary/15"
                    >
                      <PenLine className="h-4 w-4" strokeWidth={2} />
                      <span>Suggest edit</span>
                    </button>
                  </div>
                  <p className="font-heirloom-serif text-lg italic leading-relaxed text-heirloom-text-primary sm:text-xl">
                    &ldquo;{chapterOne.livingPassage}&rdquo;
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-heirloom-border/60 pt-2.5 text-sm text-heirloom-text-tertiary">
                    <span>Remember something differently? Anyone in the family can suggest corrections.</span>
                    <ShieldCheck className="h-[15px] w-[15px]" strokeWidth={1.75} />
                  </div>
                </div>

                <p>{chapterOne.finalParagraph}</p>
              </section>

              {suggestOpen && (
                <div className="mx-auto my-6 max-w-[740px] rounded-xl border border-heirloom-border/80 bg-heirloom-surface-container p-6 shadow-lg">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Feather className="h-5 w-5 text-heirloom-primary" strokeWidth={1.75} />
                      <h3 className="font-heirloom-serif text-xl text-heirloom-text-primary">Suggest a Revision</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSuggestOpen(false)}
                      aria-label="Close"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-heirloom-bg-card text-heirloom-text-secondary transition-colors hover:text-heirloom-text-primary"
                    >
                      <X className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>
                  <p className="mb-4 text-sm text-heirloom-text-secondary">
                    Your suggested correction will be gently reviewed by {chapterOne.curatedBy} before being etched
                    into the permanent heirloom record.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-sm font-semibold uppercase tracking-wider text-heirloom-text-primary">
                        Your Name or Relation
                      </label>
                      <input
                        type="text"
                        value={suggestName}
                        onChange={(e) => setSuggestName(e.target.value)}
                        placeholder="e.g., Cousin Timothy or Aunt Claire"
                        className="w-full rounded-lg border border-heirloom-border bg-heirloom-bg-card px-3.5 py-2 text-sm text-heirloom-text-primary placeholder:text-heirloom-text-tertiary focus:outline-none focus:ring-2 focus:ring-heirloom-primary/30"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold uppercase tracking-wider text-heirloom-text-primary">
                        Suggested Correction / Added Detail
                      </label>
                      <textarea
                        rows={2}
                        value={suggestText}
                        onChange={(e) => setSuggestText(e.target.value)}
                        placeholder="Actually, I remember it happening a little differently..."
                        className="w-full resize-none rounded-lg border border-heirloom-border bg-heirloom-bg-card px-3.5 py-2 text-sm text-heirloom-text-primary placeholder:text-heirloom-text-tertiary focus:outline-none focus:ring-2 focus:ring-heirloom-primary/30"
                      />
                    </div>
                    <div className="flex justify-end gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setSuggestOpen(false)}
                        className="rounded-full px-4 py-1.5 text-sm font-semibold text-heirloom-text-secondary transition-all hover:bg-heirloom-bg-card"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={submitSuggestion}
                        className="flex items-center gap-1.5 rounded-full bg-heirloom-primary px-5 py-1.5 text-sm font-semibold text-heirloom-on-primary shadow-sm transition-all hover:bg-heirloom-primary-hover"
                      >
                        <Send className="h-[14px] w-[14px]" strokeWidth={2} />
                        <span>Submit to Curator</span>
                      </button>
                    </div>
                  </div>
                  {suggestSubmitted && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-heirloom-success-light px-2.5 py-2 text-sm text-heirloom-success">
                      <ShieldCheck className="h-[17px] w-[17px]" strokeWidth={2} />
                      <span>Thank you! Your revision suggestion has been shared with {chapterOne.curatedBy.split(' ')[0]}.</span>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-10 flex flex-col items-center border-t border-heirloom-border/40 pb-4 pt-6 text-center">
                <span className="mb-2 font-heirloom-serif text-2xl italic text-heirloom-text-secondary">
                  End of Chapter One
                </span>
                <div className="mb-3 h-0.5 w-10 rounded-full bg-heirloom-primary/30" />
                <p className="max-w-[440px] text-sm leading-relaxed text-heirloom-text-tertiary">
                  This archival record was assembled using handwritten journals, recorded audiotapes, and photographs
                  preserved by the family.
                </p>
              </div>
            </div>
          </article>

          {/* Reflections */}
          <aside id="reflection-section" className="col-span-12 flex h-full min-h-0 flex-col gap-3 lg:col-span-4">
            <div className="shrink-0 rounded-2xl border border-heirloom-border/80 bg-heirloom-bg-card p-5 shadow-sm">
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-heirloom-primary-light text-heirloom-primary">
                    <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                  <h2 className="font-heirloom-serif text-xl text-heirloom-text-primary">Family Reflections</h2>
                </div>
                <span className="rounded-full bg-heirloom-primary-light px-2.5 py-0.5 text-sm font-bold text-heirloom-primary">
                  {reflections.length} Shared
                </span>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-heirloom-text-secondary">
                Your voice becomes part of this family heirloom. Add personal notes or stories.
              </p>
              <div className="space-y-2.5">
                <textarea
                  rows={2}
                  value={reflectionInput}
                  onChange={(e) => setReflectionInput(e.target.value)}
                  placeholder="Share a memory, reaction, or personal story that this chapter brings to mind..."
                  className="w-full resize-none rounded-lg border border-heirloom-border/70 bg-heirloom-surface-container-low px-3 py-3 text-sm text-heirloom-text-primary placeholder:text-heirloom-text-tertiary focus:outline-none focus:ring-2 focus:ring-heirloom-primary/20"
                />
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <User className="pointer-events-none absolute left-2.5 top-2 h-[15px] w-[15px] text-heirloom-text-tertiary" strokeWidth={2} />
                    <input
                      type="text"
                      value={reflectionAuthor}
                      onChange={(e) => setReflectionAuthor(e.target.value)}
                      placeholder="Your name & relation"
                      className="w-full rounded-lg border border-heirloom-border/70 bg-heirloom-surface-container-low py-1.5 pl-8 pr-2.5 text-sm text-heirloom-text-primary placeholder:text-heirloom-text-tertiary focus:outline-none focus:ring-2 focus:ring-heirloom-primary/20"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={postReflection}
                    className="flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full bg-heirloom-primary px-4 py-1.5 text-sm font-semibold text-heirloom-on-primary shadow-sm transition-all hover:bg-heirloom-primary-hover"
                  >
                    <Feather className="h-[14px] w-[14px]" strokeWidth={2} />
                    <span>Post</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {reflections.map((r) => (
                <div key={r.id} className="rounded-xl border border-heirloom-border/80 bg-heirloom-bg-card p-4 shadow-sm transition-all hover:shadow-md">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-heirloom-secondary-container text-sm font-bold tracking-tight text-heirloom-text-primary">
                        {initialsOf(r.author)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-heirloom-text-primary">{r.author}</span>
                          <span className="rounded-full bg-heirloom-surface-container px-1.5 py-0.5 text-sm font-semibold uppercase text-heirloom-text-secondary">
                            {r.relation}
                          </span>
                        </div>
                        <span className="text-sm text-heirloom-text-tertiary">{r.timeAgo}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleLike(r.id)}
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-semibold transition-colors ${
                        likedIds.has(r.id)
                          ? 'bg-heirloom-danger-light text-heirloom-danger'
                          : 'bg-heirloom-surface-container-low text-heirloom-text-secondary hover:bg-heirloom-danger-light hover:text-heirloom-danger'
                      }`}
                    >
                      <Heart className="h-4 w-4 text-heirloom-danger" strokeWidth={2} fill={likedIds.has(r.id) ? 'currentColor' : 'none'} />
                      <span>{r.likes}</span>
                    </button>
                  </div>
                  <p className="mb-2.5 text-sm leading-relaxed text-heirloom-text-primary">{r.body}</p>
                  <div className="flex items-center gap-3 border-t border-heirloom-border/50 pt-1.5 text-sm text-heirloom-text-tertiary">
                    <button type="button" className="flex items-center gap-1 transition-colors hover:text-heirloom-primary">
                      <Reply className="h-3 w-3" strokeWidth={2} />
                      <span>Reply</span>
                    </button>
                    <span>•</span>
                    <button type="button" onClick={handleCopyLink} className="flex items-center gap-1 transition-colors hover:text-heirloom-primary">
                      <Share2 className="h-3 w-3" strokeWidth={2} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex shrink-0 items-start gap-2.5 rounded-xl border border-heirloom-primary/20 bg-heirloom-primary-light/40 p-3 text-sm text-heirloom-text-secondary">
              <ShieldCheck className="mt-0.5 h-[17px] w-[17px] shrink-0 text-heirloom-primary" strokeWidth={1.75} />
              <p className="leading-relaxed">
                Family reflections are permanently safeguarded in the private family archive vault with verified
                timestamps.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <footer className="flex h-10 w-full shrink-0 items-center border-t border-heirloom-border/80 bg-heirloom-bg-page">
        <div className="mx-auto flex w-full max-w-[1840px] items-center justify-between px-8 text-sm text-heirloom-text-tertiary">
          <p className="font-heirloom-serif text-sm italic text-heirloom-text-secondary">
            Preserving generational memories with quiet dignity.
          </p>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="#" className="transition-colors hover:text-heirloom-primary">About</Link>
            <Link href="#" className="transition-colors hover:text-heirloom-primary">Privacy</Link>
            <span>© The Memoir Project</span>
          </div>
        </div>
      </footer>

      <HeirloomToast toast={toast} onDismiss={hideToast} />
    </div>
  )
}
