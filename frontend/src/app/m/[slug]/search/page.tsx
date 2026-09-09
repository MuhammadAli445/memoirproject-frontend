'use client'

import { use, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  BookOpen,
  Camera,
  Download,
  ExternalLink,
  Eye,
  Home,
  Key,
  Lock,
  PlusCircle,
  Search,
  Volume2,
  X,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useHeirloomData, type SearchResult } from '@/data/heirloom'
import HeirloomFooter from '@/components/heirloom/HeirloomFooter'
import { HeirloomToast, useHeirloomToast } from '@/components/heirloom/HeirloomToast'

const kindIcon = { chapter: BookOpen, photo: Camera, recording: Volume2 } as const

type ExportState = 'idle' | 'preparing' | 'done'

export default function SearchExportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const { memoirMeta, searchResults } = useHeirloomData()
  const { toast, showToast, hideToast } = useHeirloomToast()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'all' | SearchResult['category']>('all')
  const [exportState, setExportState] = useState<ExportState>('idle')

  const counts = useMemo(() => {
    return {
      all: searchResults.length,
      chapters: searchResults.filter((r) => r.category === 'chapters').length,
      photos: searchResults.filter((r) => r.category === 'photos').length,
      recordings: searchResults.filter((r) => r.category === 'recordings').length,
    }
  }, [searchResults])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return searchResults.filter((r) => {
      const matchesCategory = category === 'all' || r.category === category
      const matchesQuery =
        !q || r.title.toLowerCase().includes(q) || r.excerpt.toLowerCase().includes(q) || r.badge.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [query, category, searchResults])

  function handleExportClick() {
    if (!user) {
      router.push('/login')
      return
    }
    setExportState('preparing')
    setTimeout(() => {
      setExportState('done')
      showToast('Your download has started', Download)
      setTimeout(() => setExportState('idle'), 3000)
    }, 1200)
  }

  return (
    <div className="flex min-h-screen flex-col bg-heirloom-bg-page font-heirloom-sans text-heirloom-text-primary antialiased">
      <header className="sticky top-0 z-40 w-full border-b border-heirloom-border/60 bg-heirloom-bg-page/95 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1560px] items-center justify-between px-8">
          <div className="flex items-center gap-8">
            <Link href={`/m/${slug}`} className="group flex items-center gap-2">
              <span className="font-heirloom-serif text-[30px] tracking-tight text-heirloom-text-primary transition-colors group-hover:text-heirloom-primary">
                The Memoir Project
              </span>
            </Link>
            <div className="hidden items-center gap-2 border-l border-heirloom-border pl-4 text-heirloom-text-tertiary md:flex">
              <span className="text-sm font-medium uppercase tracking-widest text-heirloom-text-tertiary">
                Search
              </span>
              <span className="text-heirloom-text-tertiary/60">/</span>
              <span className="text-sm font-medium text-heirloom-text-secondary">{memoirMeta.title}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden items-center gap-1.5 rounded-full border border-heirloom-border/50 bg-heirloom-surface-container-low/90 px-4 py-1 font-heirloom-mono text-sm uppercase tracking-widest text-heirloom-text-tertiary lg:inline-flex">
              Ref. {memoirMeta.archiveCode}
            </span>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-heirloom-border/70 bg-heirloom-bg-card-alt px-4 py-1.5 text-base text-heirloom-text-secondary shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-heirloom-primary" />
              <span className="font-medium text-heirloom-text-primary">{memoirMeta.stories + memoirMeta.reflections} Memories</span>
              <span className="text-heirloom-text-tertiary">•</span>
              <span>{memoirMeta.photos} Photos</span>
              <span className="text-heirloom-text-tertiary">•</span>
              <span>{memoirMeta.chapters} Chapters</span>
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

      <main className="w-full flex-1 bg-heirloom-bg-page">
        <div className="mx-auto max-w-[1560px] px-8 py-8">
          <div className="mb-6 flex items-center justify-between gap-2 border-b border-heirloom-border/50 pb-2.5">
            <Link
              href={`/m/${slug}`}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-heirloom-text-secondary transition-colors hover:text-heirloom-primary"
            >
              <ArrowLeft className="h-[18px] w-[18px] transition-transform group-hover:-translate-x-1" strokeWidth={2} />
              <span>Back to Memoir ({memoirMeta.title})</span>
            </Link>
            <span className="font-heirloom-mono text-sm text-heirloom-text-tertiary">Showing everything in this memoir</span>
          </div>

          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
            {/* Left column */}
            <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:col-span-5">
              <div>
                <h1 className="font-heirloom-serif text-[40px] leading-tight tracking-tight text-heirloom-text-primary">
                  Search Memories & Stories
                </h1>
                <p className="mt-1 text-base leading-[1.7] text-heirloom-text-secondary">
                  Find any story, photo, or recollection recorded by the family.
                </p>
              </div>

              <div className="relative w-full">
                <div className="relative flex items-center rounded-2xl border border-heirloom-border/80 bg-heirloom-bg-card shadow-sm transition-all focus-within:border-heirloom-primary/50">
                  <Search className="pointer-events-none ml-6 h-[26px] w-[26px] text-heirloom-primary" strokeWidth={1.75} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by person, place, keyword, or year..."
                    className="h-14 w-full bg-transparent pl-4 pr-16 text-base text-heirloom-text-primary placeholder:text-heirloom-text-tertiary focus:outline-none"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      title="Clear search"
                      className="absolute right-3 flex h-8 w-8 items-center justify-center rounded-full text-heirloom-text-tertiary transition-colors hover:bg-heirloom-surface-container-high hover:text-heirloom-text-primary"
                    >
                      <X className="h-[18px] w-[18px]" strokeWidth={2} />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between px-4 pt-1 text-sm text-heirloom-text-tertiary">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" strokeWidth={2} />
                    Searching every story, photo, and recording
                  </span>
                  <span className="font-heirloom-mono text-sm text-heirloom-text-tertiary">Press Enter or type to filter</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium uppercase tracking-wider text-heirloom-text-tertiary">
                  Filter by Category
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      { key: 'all', label: 'All Results', count: counts.all },
                      { key: 'chapters', label: 'Stories & Chapters', count: counts.chapters },
                      { key: 'photos', label: 'Photos', count: counts.photos },
                      { key: 'recordings', label: 'Audio & Video', count: counts.recordings },
                    ] as const
                  ).map((chip) => (
                    <button
                      key={chip.key}
                      type="button"
                      onClick={() => setCategory(chip.key)}
                      className={`h-8 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-all ${
                        category === chip.key
                          ? 'bg-heirloom-primary-light text-heirloom-primary shadow-sm ring-1 ring-heirloom-primary/20'
                          : 'border border-heirloom-border bg-heirloom-bg-card text-heirloom-text-secondary hover:bg-heirloom-surface-container hover:text-heirloom-text-primary'
                      }`}
                    >
                      {chip.label} ({chip.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* PDF Export Hero Card */}
              <div className="relative overflow-hidden rounded-2xl border border-[#E3D9CD] bg-gradient-to-br from-[#FAF7F4] via-[#F4ECE3] to-[#EDE4D9] p-6 shadow-sm xl:p-8">
                <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-heirloom-primary/40 to-transparent" />
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-heirloom-border/80 bg-heirloom-bg-card text-heirloom-primary shadow-sm">
                      <Lock className="h-8 w-8" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-heirloom-primary">
                          <Lock className="h-4 w-4" strokeWidth={2} />
                          Owner Only
                        </span>
                        <span className="text-heirloom-text-tertiary">•</span>
                        <span className="text-sm font-medium text-heirloom-text-secondary">High Quality</span>
                      </div>
                      <h2 className="font-heirloom-serif text-[28px] leading-snug text-heirloom-text-primary">
                        Download the Whole Memoir as a PDF
                      </h2>
                    </div>
                  </div>
                  <p className="pl-1 text-sm leading-relaxed text-heirloom-text-secondary">
                    To protect the family&apos;s privacy, only the memoir owner can download a full copy.
                  </p>
                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleExportClick}
                      disabled={exportState === 'preparing'}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-heirloom-primary px-4 py-3 text-sm font-medium text-heirloom-on-primary shadow-sm transition-all hover:bg-heirloom-primary-hover disabled:opacity-80"
                    >
                      {exportState === 'preparing' ? (
                        <>
                          <Download className="h-4 w-4 animate-bounce text-white/90" strokeWidth={2} />
                          <span>Preparing your copy...</span>
                        </>
                      ) : exportState === 'done' ? (
                        <>
                          <Download className="h-4 w-4 text-white/90" strokeWidth={2} />
                          <span>Download Started</span>
                        </>
                      ) : user ? (
                        <>
                          <Download className="h-4 w-4 text-white/90" strokeWidth={2} />
                          <span>Download PDF</span>
                        </>
                      ) : (
                        <>
                          <Key className="h-4 w-4 text-white/90" strokeWidth={2} />
                          <span>Sign In to Download</span>
                        </>
                      )}
                    </button>
                    <div className="mt-1 flex items-start gap-2 rounded-lg border border-heirloom-border bg-heirloom-bg-card-alt p-2.5 text-sm text-heirloom-text-secondary">
                      <Lock className="mt-0.5 h-4 w-4 shrink-0 text-heirloom-primary" strokeWidth={2} />
                      <span>
                        You&apos;ll need to sign in with the owner&apos;s email and password to download.
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-1 pt-1 text-sm text-heirloom-text-secondary">
                      <button
                        type="button"
                        onClick={() => showToast('We let the memoir owner know you asked')}
                        className="text-sm font-semibold text-heirloom-text-secondary underline decoration-dotted underline-offset-4 transition-colors hover:text-heirloom-primary"
                      >
                        Ask the Owner for a Copy
                      </button>
                      <span className="text-sm italic text-heirloom-text-tertiary">Updated yesterday</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: results */}
            <div className="flex flex-col gap-6 lg:col-span-7">
              <div className="flex items-center justify-between border-b border-heirloom-border/70 pb-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-[22px] font-semibold text-heirloom-text-primary">
                    Results for{' '}
                    <span className="font-heirloom-serif text-[26px] font-normal italic text-heirloom-primary">
                      &ldquo;{query || 'everything'}&rdquo;
                    </span>
                  </h3>
                  <span className="ml-2 font-heirloom-mono text-sm text-heirloom-text-tertiary">
                    ({filtered.length} of {searchResults.length} shown)
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {filtered.map((result) => {
                  const Icon = kindIcon[result.kind]
                  return (
                    <article
                      key={result.id}
                      className="group relative flex flex-col gap-3 rounded-2xl border border-heirloom-border/80 bg-heirloom-bg-card p-6 shadow-sm transition-all hover:border-heirloom-primary/30 hover:shadow-md sm:flex-row"
                    >
                      {result.kind === 'photo' && (
                        <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-xl border border-heirloom-border bg-gradient-to-br from-[#e9dcc8] via-[#d9c19f] to-[#a9835a] shadow-inner sm:w-56">
                          <div className="flex h-full w-full items-center justify-center text-heirloom-bg-card/70">
                            <Camera className="h-9 w-9" strokeWidth={1.25} />
                          </div>
                          <div className="absolute bottom-2 left-2 rounded bg-heirloom-text-primary/75 px-2 py-0.5 font-heirloom-mono text-sm text-heirloom-on-primary backdrop-blur-sm">
                            {result.image?.meta}
                          </div>
                        </div>
                      )}
                      <div className="flex w-full flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-heirloom-primary-light px-2.5 py-0.5 text-sm font-semibold text-heirloom-primary">
                            <Icon className="h-[14px] w-[14px]" strokeWidth={2} />
                            {result.badge}
                          </span>
                        </div>
                        <h4 className="font-heirloom-serif text-[24px] text-heirloom-text-primary transition-colors group-hover:text-heirloom-primary">
                          {result.title}
                        </h4>
                        <p className="text-[15px] leading-relaxed text-heirloom-text-secondary">{result.excerpt}</p>
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-heirloom-border/60 pt-2 text-sm text-heirloom-text-tertiary">
                          <div className="flex items-center gap-1.5">
                            <span>{result.metaLeft}</span>
                            {result.metaAuthor && (
                              <>
                                <span>•</span>
                                <span className="italic">{result.metaAuthor}</span>
                              </>
                            )}
                          </div>
                          <Link
                            href={`/book/memory/${result.id}`}
                            className="inline-flex items-center gap-1 text-base font-semibold text-heirloom-primary transition-transform hover:text-heirloom-primary-hover group-hover:translate-x-1"
                          >
                            <span>{result.actionLabel}</span>
                            {result.kind === 'photo' ? (
                              <Eye className="h-4 w-4" strokeWidth={2} />
                            ) : (
                              <ExternalLink className="h-4 w-4" strokeWidth={2} />
                            )}
                          </Link>
                        </div>
                      </div>
                    </article>
                  )
                })}
                {filtered.length === 0 && searchResults.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-heirloom-border p-10 text-center text-sm text-heirloom-text-tertiary">
                    Nothing has been recorded yet. Once memories are added, they&apos;ll show up here to search
                    through.
                  </div>
                )}
                {filtered.length === 0 && searchResults.length > 0 && (
                  <div className="rounded-2xl border border-dashed border-heirloom-border p-10 text-center text-sm text-heirloom-text-tertiary">
                    No memories match &ldquo;{query}&rdquo;. Try a different name, place, or year.
                  </div>
                )}
              </div>

              <div className="mt-1 flex flex-col items-center justify-between gap-4 rounded-2xl border border-heirloom-border/70 bg-heirloom-bg-card-alt p-6 shadow-sm sm:flex-row">
                <div className="flex items-center gap-4 text-left">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-heirloom-primary/10 text-heirloom-primary">
                    <PlusCircle className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <p className="text-sm text-heirloom-text-secondary">
                    <strong className="block font-semibold text-heirloom-text-primary sm:inline">
                      Can&apos;t find a particular memory?
                    </strong>{' '}
                    Anyone in the family can contribute stories or suggest corrections.
                  </p>
                </div>
                <Link
                  href={`/m/${slug}/memories`}
                  className="flex w-full shrink-0 items-center justify-center gap-1.5 rounded-full border border-heirloom-border bg-heirloom-surface-container px-6 py-2.5 text-sm font-semibold text-heirloom-text-primary transition-all hover:bg-heirloom-surface-container-high sm:w-auto"
                >
                  <PlusCircle className="h-[18px] w-[18px]" strokeWidth={2} />
                  <span>Contribute a Memory</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <HeirloomFooter />
      <HeirloomToast toast={toast} onDismiss={hideToast} />
    </div>
  )
}
