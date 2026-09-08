'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Check,
  Copy,
  Download,
  ExternalLink,
  History,
  Home,
  Key,
  Link2,
  Lock,
  LockOpen,
  Mail,
  ShieldCheck,
  ShieldLock,
  Trash2,
  Users,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { memoirMeta } from '@/data/heirloom'
import { HeirloomToast, useHeirloomToast } from '@/components/heirloom/HeirloomToast'
import HeirloomFooter from '@/components/heirloom/HeirloomFooter'

export default function ManageAccessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast, showToast } = useHeirloomToast()

  const [copied, setCopied] = useState(false)
  const [publicSharingActive, setPublicSharingActive] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [pdfState, setPdfState] = useState<'idle' | 'preparing'>('idle')

  function copyLink() {
    navigator.clipboard?.writeText(memoirMeta.publicUrl).catch(() => {})
    setCopied(true)
    showToast('Public archive link copied to clipboard')
    setTimeout(() => setCopied(false), 2500)
  }

  function revokePublicLink() {
    if (!confirm('Revoke public link access? Visitors with the URL will no longer be able to read or contribute.')) return
    setPublicSharingActive(false)
    showToast('Public link access revoked', LockOpen)
  }

  function revokeAllAccess() {
    if (!confirm('Are you sure you want to revoke all public and collaborator access? All collaborator edit invites will be deactivated.')) return
    setPublicSharingActive(false)
    showToast('All external access revoked', Lock)
  }

  function exportPdf() {
    setPdfState('preparing')
    showToast('Authenticating owner...', Key)
    setTimeout(() => {
      setPdfState('idle')
      showToast('Owner verified. Preparing archival 300 DPI PDF download...', Download)
    }, 1200)
  }

  function executeDelete() {
    setDeleteModalOpen(false)
    showToast('Memoir permanently deleted. Redirecting...', Trash2)
    setTimeout(() => router.push('/dashboard'), 1800)
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-heirloom-bg-page" />
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-heirloom-bg-page font-heirloom-sans text-heirloom-text-primary">
        <header className="w-full border-b border-heirloom-border/60 bg-heirloom-bg-page/90">
          <div className="mx-auto flex h-20 max-w-[1240px] items-center justify-between px-8">
            <span className="font-heirloom-serif text-[30px] tracking-tight text-heirloom-text-primary">The Memoir Project</span>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-heirloom-border px-3.5 py-1.5 text-xs font-semibold text-heirloom-text-secondary transition-colors hover:border-heirloom-primary/40 hover:text-heirloom-primary"
            >
              <Home className="h-4 w-4" strokeWidth={2} />
              Dashboard
            </Link>
          </div>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-heirloom-primary-light text-heirloom-primary">
            <ShieldLock className="h-7 w-7" strokeWidth={1.75} />
          </div>
          <h1 className="font-heirloom-serif text-3xl text-heirloom-text-primary">Owner sign-in required</h1>
          <p className="max-w-sm text-sm leading-relaxed text-heirloom-text-secondary">
            Archive management, link revocation, and permanent deletion are restricted to the verified memoir owner.
          </p>
          <Link
            href="/login"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-heirloom-primary px-6 py-3 text-sm font-semibold text-heirloom-on-primary shadow-sm transition-all hover:bg-heirloom-primary-hover"
          >
            <Key className="h-4 w-4" strokeWidth={2} />
            Owner Sign In
          </Link>
          <Link href={`/m/${slug}`} className="mt-1 text-xs text-heirloom-text-secondary underline hover:text-heirloom-primary">
            Back to Memoir
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-heirloom-bg-page font-heirloom-sans text-heirloom-text-primary antialiased">
      <header className="sticky top-0 z-40 w-full border-b border-heirloom-border/60 bg-heirloom-bg-page/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1240px] items-center justify-between px-8">
          <Link href={`/m/${slug}`} className="group flex items-center gap-2">
            <span className="font-heirloom-serif text-[30px] tracking-tight text-heirloom-text-primary transition-colors group-hover:text-heirloom-primary">
              The Memoir Project
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden font-heirloom-serif text-sm italic text-heirloom-text-tertiary sm:inline">
              Archival Governance & Preservation
            </span>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-heirloom-border px-3.5 py-1.5 text-xs font-semibold text-heirloom-text-secondary transition-colors hover:border-heirloom-primary/40 hover:text-heirloom-primary"
            >
              <Home className="h-4 w-4" strokeWidth={2} />
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full flex-1 bg-heirloom-bg-page">
        <div className="mx-auto max-w-[1240px] px-8 py-8">
          <div className="mb-8 flex items-center justify-between border-b border-heirloom-border/70 pb-6">
            <Link
              href={`/m/${slug}`}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-heirloom-text-secondary transition-colors hover:text-heirloom-primary"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" strokeWidth={2} />
              <span>
                Back to Memoir <span className="font-normal text-heirloom-text-tertiary">({memoirMeta.title})</span>
              </span>
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-heirloom-border/80 bg-heirloom-bg-card px-4 py-1.5 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-heirloom-success opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-heirloom-success" />
              </span>
              <span className="text-xs text-heirloom-text-secondary">
                Logged in as <strong className="font-semibold text-heirloom-text-primary">{user.full_name} (Owner)</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            {/* Left column */}
            <div className="flex flex-col gap-6 lg:col-span-4">
              <div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-heirloom-primary-light px-3 py-1">
                  <ShieldLock className="h-[15px] w-[15px] text-heirloom-primary" strokeWidth={2} />
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-heirloom-primary">
                    Archive Management
                  </span>
                </div>
                <h1 className="mb-2 font-heirloom-serif text-[34px] leading-tight tracking-tight text-heirloom-text-primary">
                  Manage Memoir Access &amp; Privacy
                </h1>
                <p className="leading-relaxed text-heirloom-text-secondary">
                  Control who can view, contribute to, or discover{' '}
                  <em className="font-heirloom-serif not-italic font-normal text-heirloom-text-primary">{memoirMeta.title}</em>{' '}
                  archive. Manage active links, pause public discoverability, or permanently retire this collection.
                </p>
              </div>

              <div className="space-y-3 rounded-xl border border-heirloom-border bg-heirloom-bg-card p-6 shadow-sm">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-heirloom-text-tertiary">
                  Archive Metadata
                </h3>
                <div className="space-y-2 text-[13px] text-heirloom-text-secondary">
                  <div className="flex items-center gap-2">
                    <History className="h-[18px] w-[18px] text-heirloom-text-tertiary" strokeWidth={1.75} />
                    <span>
                      Created {memoirMeta.createdLabel} • Updated {memoirMeta.updatedLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className={`h-[18px] w-[18px] ${publicSharingActive ? 'text-heirloom-success' : 'text-heirloom-text-tertiary'}`} strokeWidth={1.75} />
                    <span className="font-medium text-heirloom-text-primary">
                      {publicSharingActive ? 'Public Sharing Active' : 'Public Sharing Paused'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-[18px] w-[18px] text-heirloom-text-tertiary" strokeWidth={1.75} />
                    <span>{memoirMeta.totalContributors} total contributors &amp; readers</span>
                  </div>
                </div>
              </div>

              <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-heirloom-border/90 bg-heirloom-bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-600/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-900">
                    <Lock className="h-[13px] w-[13px] text-amber-700" strokeWidth={2} />
                    <span>Owner Only</span>
                  </div>
                  <span className="font-heirloom-mono text-[11px] text-heirloom-text-tertiary">300 DPI Archival PDF</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-[22px] w-[22px] text-heirloom-primary" strokeWidth={1.75} />
                    <h3 className="text-[18px] font-semibold text-heirloom-text-primary">Preserve an Offline Copy</h3>
                  </div>
                  <p className="text-[13px] leading-relaxed text-heirloom-text-secondary">
                    Archival Print PDF generation is restricted exclusively to the memoir creator and verified owners.
                  </p>
                </div>
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={exportPdf}
                    disabled={pdfState === 'preparing'}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-heirloom-primary px-4 py-2.5 text-sm font-semibold text-heirloom-on-primary shadow-sm transition-all active:scale-[0.99] disabled:opacity-80"
                  >
                    <Key className="h-[17px] w-[17px]" strokeWidth={2} />
                    <span>{pdfState === 'preparing' ? 'Verifying owner…' : 'Export Archival PDF'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Permission request sent to the memoir owner', Mail)}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-heirloom-border bg-heirloom-bg-card-alt px-4 py-2 text-sm font-semibold text-heirloom-text-secondary transition-colors hover:bg-heirloom-surface-container hover:text-heirloom-text-primary"
                  >
                    <Mail className="h-4 w-4" strokeWidth={2} />
                    <span>Request Permission from Owner</span>
                  </button>
                </div>
                <div className="flex items-start gap-2 border-t border-heirloom-border/60 pt-2 text-[12px] leading-normal text-heirloom-text-tertiary">
                  <ShieldLock className="mt-0.5 h-[15px] w-[15px] shrink-0" strokeWidth={1.75} />
                  <p>Only the verified creator of this memoir can authorize or download archival print files.</p>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-8 lg:col-span-8">
              <section className="rounded-xl border border-heirloom-border bg-heirloom-bg-card p-8 shadow-sm">
                <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-heirloom-primary-light text-heirloom-primary">
                      <ExternalLink className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <h2 className="text-[22px] font-semibold text-heirloom-text-primary">Active Public Link</h2>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 self-start rounded-full px-4 py-1 text-[12px] font-medium sm:self-auto ${
                      publicSharingActive ? 'bg-heirloom-success-light text-heirloom-success' : 'bg-heirloom-surface-container text-heirloom-text-tertiary'
                    }`}
                  >
                    <LockOpen className="h-[14px] w-[14px]" strokeWidth={2} />
                    {publicSharingActive ? 'Public (No sign-in required)' : 'Access Paused'}
                  </span>
                </div>
                <p className="mb-8 text-heirloom-text-secondary">
                  Anyone with this secret URL can read the memoir, suggest corrections, and contribute generational
                  reflections.
                </p>

                <div className="mb-6 rounded-lg border border-heirloom-border/80 bg-heirloom-bg-card-alt p-6 shadow-inner">
                  <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <Link2 className="h-5 w-5 shrink-0 text-heirloom-text-tertiary" strokeWidth={1.75} />
                      <span className="select-all truncate font-heirloom-mono text-[13px] text-heirloom-text-primary">
                        {memoirMeta.publicUrl}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={copyLink}
                        className="flex items-center gap-1.5 rounded-full border border-heirloom-border bg-heirloom-bg-card px-4 py-1.5 text-[12px] font-semibold text-heirloom-text-primary shadow-sm transition-colors hover:bg-heirloom-surface-container"
                      >
                        {copied ? <Check className="h-4 w-4" strokeWidth={2} /> : <Copy className="h-4 w-4" strokeWidth={2} />}
                        <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                      </button>
                      <Link
                        href={`/m/${slug}`}
                        title="Open Link"
                        className="inline-flex items-center justify-center rounded-full p-1.5 text-heirloom-text-secondary transition-colors hover:bg-heirloom-primary-light hover:text-heirloom-primary"
                      >
                        <ExternalLink className="h-[18px] w-[18px]" strokeWidth={2} />
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-heirloom-border/50 pt-2 text-[13px] text-heirloom-text-tertiary">
                    <span className="flex items-center gap-1.5">
                      <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
                      {memoirMeta.visitsThisMonth} visits this month
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">{memoirMeta.reflectionsPosted} family reflections posted</span>
                  </div>
                </div>

                <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-heirloom-border/60 bg-heirloom-surface-container-low/70 p-6 sm:flex-row sm:items-center">
                  <p className="max-w-md text-[13px] leading-relaxed text-heirloom-text-secondary">
                    Temporarily pause or revoke public link access. Existing links will immediately display a private
                    notice. You can re-enable sharing at any time.
                  </p>
                  <button
                    type="button"
                    onClick={revokePublicLink}
                    className="shrink-0 rounded-full border border-heirloom-danger/30 bg-heirloom-bg-card px-6 py-2 text-center text-sm font-semibold text-heirloom-danger shadow-sm transition-colors hover:bg-heirloom-danger-light"
                  >
                    Revoke Public Link
                  </button>
                </div>
              </section>

              <section className="relative overflow-hidden rounded-xl border border-heirloom-danger/25 bg-heirloom-bg-card p-8 shadow-sm">
                <div className="absolute left-0 right-0 top-0 h-1.5 bg-heirloom-danger" />
                <div className="mb-8 flex items-center gap-2 pt-1">
                  <AlertTriangle className="h-[22px] w-[22px] text-heirloom-danger" strokeWidth={2} />
                  <span className="text-[12px] font-bold uppercase tracking-wider text-heirloom-danger">Danger Zone</span>
                </div>

                <div className="flex flex-col justify-between gap-6 border-b border-heirloom-border/80 pb-8 sm:flex-row sm:items-start">
                  <div className="max-w-lg">
                    <h3 className="mb-1 text-[19px] font-semibold text-heirloom-text-primary">
                      Revoke All Public &amp; Collaborator Access
                    </h3>
                    <p className="leading-relaxed text-heirloom-text-secondary">
                      Instantly deactivate all shared URLs and collaborator edit invites. Only you (the owner) will
                      be able to access the memoir until new links are generated. All memories, media, and comments
                      remain intact.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={revokeAllAccess}
                    className="shrink-0 rounded-full border border-heirloom-danger/20 bg-heirloom-danger-light px-6 py-2.5 text-sm font-semibold text-heirloom-danger shadow-sm transition-all active:scale-[0.98] hover:bg-heirloom-danger/20"
                  >
                    Revoke Access
                  </button>
                </div>

                <div className="relative my-8 flex h-px w-full items-center justify-center bg-heirloom-surface-container-highest">
                  <span className="bg-heirloom-bg-card px-4 font-heirloom-serif text-sm italic text-heirloom-text-tertiary">
                    irreversible archival action
                  </span>
                </div>

                <div className="flex flex-col justify-between gap-6 pt-1 sm:flex-row sm:items-start">
                  <div className="max-w-lg">
                    <h3 className="mb-1 text-[19px] font-semibold text-heirloom-text-primary">Permanently Delete This Memoir</h3>
                    <p className="mb-3 leading-relaxed text-heirloom-text-secondary">
                      Irreversibly delete{' '}
                      <em className="font-heirloom-serif not-italic font-normal text-heirloom-text-primary">{memoirMeta.title}</em>,
                      including all {memoirMeta.chapters} chapters, {memoirMeta.stories} transcribed stories,{' '}
                      {memoirMeta.photos} archival Kodak photographs, and {memoirMeta.reflections} visitor reflections.
                      Once deleted, this archival record cannot be recovered.
                    </p>
                    <div className="inline-flex items-center gap-1.5 rounded-md bg-heirloom-danger-light px-3 py-1 text-[12px] text-heirloom-danger">
                      <AlertTriangle className="h-4 w-4" strokeWidth={2} />
                      <span>This action is permanent and cannot be undone.</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirmText('')
                      setDeleteModalOpen(true)
                    }}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-heirloom-danger px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-heirloom-danger-hover hover:shadow-lg active:scale-[0.98]"
                  >
                    <Trash2 className="h-[18px] w-[18px]" strokeWidth={2} />
                    <span>Delete Memoir Permanently</span>
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <HeirloomFooter />

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-heirloom-overlay p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-xl border border-heirloom-border bg-heirloom-bg-card p-8 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-heirloom-danger-light text-heirloom-danger">
              <Trash2 className="h-7 w-7" strokeWidth={2} />
            </div>
            <h3 className="mb-1 text-[22px] font-semibold text-heirloom-text-primary">
              Delete &ldquo;{memoirMeta.title}&rdquo;?
            </h3>
            <p className="mb-6 leading-relaxed text-heirloom-text-secondary">
              This will immediately remove all chapters, high-resolution archival scans, audio transcriptions, and
              family reflections. This action is final.
            </p>
            <div className="mb-8">
              <label className="mb-1 block text-[12px] font-semibold text-heirloom-text-primary" htmlFor="delete-confirm-input">
                Please type <span className="font-heirloom-mono uppercase text-heirloom-danger">DELETE</span> to confirm:
              </label>
              <input
                id="delete-confirm-input"
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-lg border border-heirloom-border bg-heirloom-bg-card-alt px-4 py-2 font-heirloom-mono text-sm text-heirloom-text-primary shadow-inner placeholder:text-heirloom-text-tertiary focus:outline-none focus:ring-2 focus:ring-heirloom-danger"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="rounded-full border border-heirloom-border bg-heirloom-bg-card-alt px-6 py-2 text-sm font-semibold text-heirloom-text-secondary transition-colors hover:bg-heirloom-surface-container hover:text-heirloom-text-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmText.trim().toUpperCase() !== 'DELETE'}
                onClick={executeDelete}
                className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
                  deleteConfirmText.trim().toUpperCase() === 'DELETE'
                    ? 'cursor-pointer bg-heirloom-danger text-white shadow-md hover:bg-heirloom-danger-hover active:scale-[0.98]'
                    : 'cursor-not-allowed bg-heirloom-surface-container-high text-heirloom-text-tertiary'
                }`}
              >
                Permanently Delete Memoir
              </button>
            </div>
          </div>
        </div>
      )}

      <HeirloomToast toast={toast} />
    </div>
  )
}
