import { useEffect, useRef, useState } from 'react'
import { AlignLeft, Camera, MapPin, Mic, Pause, Play, Save, Trash2, X } from 'lucide-react'
import type { Memory, MemoryType } from '../types'
import type { RecordingResult } from '../hooks/useVoiceRecorder'
import { formatDuration, longDateLabel } from '../utils/format'
import RecordingOverlay from './RecordingOverlay'

interface MemoryComposerProps {
  isOpen: boolean
  draft: Memory | null
  /** Prefills the body when opening a brand-new memory (e.g. text typed on the Guide screen). */
  initialBody?: string
  /** When true, opens straight into the recording overlay (arriving from the Guide screen's mic tap). */
  autoRecord?: boolean
  onClose: () => void
  onSave: (memory: Memory) => void
}

const MAX_PHOTO_MB = 20

export default function MemoryComposer({
  isOpen,
  draft,
  initialBody = '',
  autoRecord = false,
  onClose,
  onSave,
}: MemoryComposerProps) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [location, setLocation] = useState('')
  const [showLocationField, setShowLocationField] = useState(false)
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null)
  const [photoCaption, setPhotoCaption] = useState('')
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [audioResult, setAudioResult] = useState<RecordingResult | null>(null)
  const [isRecordingOpen, setIsRecordingOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) return
    setTitle(draft?.title ?? '')
    setBody(draft?.body ?? initialBody)
    setLocation(draft?.location ?? '')
    setShowLocationField(Boolean(draft?.location))
    setPhotoDataUrl(draft?.photoDataUrl ?? null)
    setPhotoCaption(draft?.photoCaption ?? '')
    setPhotoError(null)
    setAudioResult(draft?.audioUrl ? { url: draft.audioUrl, durationSeconds: draft.audioDurationSeconds ?? 0 } : null)
    setIsRecordingOpen(autoRecord)
  }, [isOpen, draft, autoRecord, initialBody])

  if (!isOpen) return null

  const hasContent = Boolean(title.trim() || body.trim() || photoDataUrl || audioResult)

  const handlePhotoPick = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please choose an image file.')
      return
    }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      setPhotoError(`That photo is over ${MAX_PHOTO_MB}MB — try a smaller one.`)
      return
    }
    setPhotoError(null)
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') setPhotoDataUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const buildMemory = (audio: RecordingResult | null): Memory => {
    const resolvedType: MemoryType = audio ? 'voice' : photoDataUrl ? 'photo' : 'text'
    const resolvedTitle =
      title.trim() ||
      `Untitled memory — ${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`

    return {
      id: draft?.id ?? crypto.randomUUID(),
      type: resolvedType,
      title: resolvedTitle,
      body,
      createdAt: draft?.createdAt ?? new Date().toISOString(),
      updatedAt: draft ? new Date().toISOString() : undefined,
      isDraft: false,
      location: location.trim() || undefined,
      photoDataUrl,
      photoCaption,
      audioUrl: audio?.url ?? null,
      audioDurationSeconds: audio?.durationSeconds,
    }
  }

  const handleSave = () => {
    onSave(buildMemory(audioResult))
  }

  const handleRecordingConfirm = (result: RecordingResult) => {
    setAudioResult(result)
    setIsRecordingOpen(false)
  }

  const handleRecordingSaveNow = (result: RecordingResult | null) => {
    setIsRecordingOpen(false)
    if (result) setAudioResult(result)
    onSave(buildMemory(result ?? audioResult))
  }

  const statusLabel = hasContent ? 'READY TO SAVE' : 'ADD A FEW DETAILS'

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-600 pb-4">
          <span className="font-display text-lg text-ember">The Memoir Project</span>
          <button type="button" onClick={onClose} className="text-mist transition hover:text-linen" aria-label="Close">
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-mist-dim">
          DRAFTING MEMORY <span className="text-ember">• {statusLabel}</span>
        </p>

        {/* Composer card */}
        <div className="mt-4 flex-1 rounded-2xl bg-linen shadow-card">
          <div className="flex items-center justify-between border-b border-cocoa/10 px-8 py-4 text-xs font-medium uppercase tracking-[0.1em] text-cocoa/50">
            <span>{longDateLabel(draft?.createdAt ?? new Date().toISOString())}</span>
            {showLocationField ? (
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add a location"
                className="bg-transparent text-right normal-case tracking-normal text-cocoa/70 placeholder:text-cocoa/30 focus:outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => setShowLocationField(true)}
                className="flex items-center gap-1 normal-case tracking-normal text-cocoa/40 transition hover:text-cocoa/70"
              >
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
                Add location
              </button>
            )}
          </div>

          <div className="px-8 py-6">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="An optional title..."
              className="w-full border-none bg-transparent font-display text-2xl text-cocoa placeholder:text-cocoa/30 focus:outline-none"
            />
            <div className="mt-4 h-px bg-cocoa/10" />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Start writing..."
              rows={6}
              className="mt-4 w-full resize-none border-none bg-transparent text-[15px] leading-relaxed text-cocoa placeholder:text-cocoa/35 focus:outline-none"
            />

            {audioResult && <VoiceAttachedRow result={audioResult} onRemove={() => setAudioResult(null)} />}

            {photoDataUrl && (
              <div className="mt-6 overflow-hidden rounded-lg border border-cocoa/10">
                <div className="relative">
                  <img src={photoDataUrl} alt="" className="max-h-80 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotoDataUrl(null)}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-cocoa/60 text-linen transition hover:bg-cocoa/80"
                    aria-label="Remove photo"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
                <input
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="Add a caption..."
                  className="w-full border-none bg-linen-dim px-4 py-2.5 text-center text-sm italic text-cocoa/70 placeholder:text-cocoa/35 focus:outline-none"
                />
              </div>
            )}

            {photoError && <p className="mt-3 text-sm text-red-600">{photoError}</p>}
          </div>
        </div>

        {/* Bottom toolbar */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            disabled
            title="Text formatting — coming soon"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 text-mist-dim"
          >
            <AlignLeft className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => setIsRecordingOpen(true)}
            title="Record voice"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 text-mist transition hover:border-ember hover:text-ember"
          >
            <Mic className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Add photo"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 text-mist transition hover:border-ember hover:text-ember"
          >
            <Camera className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handlePhotoPick(e.target.files?.[0])}
          />

          <button
            type="button"
            onClick={handleSave}
            disabled={!hasContent}
            className="ml-auto flex items-center gap-2 rounded-lg bg-ember px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-ember-hover disabled:cursor-not-allowed disabled:bg-ember/35"
          >
            <Save className="h-4 w-4" strokeWidth={2} />
            Save Memory
          </button>
        </div>
      </div>

      {isRecordingOpen && (
        <RecordingOverlay
          title={title}
          bodyPreview={body}
          onCancel={() => setIsRecordingOpen(false)}
          onConfirm={handleRecordingConfirm}
          onSaveNow={handleRecordingSaveNow}
        />
      )}
    </div>
  )
}

function VoiceAttachedRow({ result, onRemove }: { result: RecordingResult; onRemove: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const toggle = () => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play()
  }

  return (
    <div className="mt-6 rounded-lg border border-cocoa/10 bg-linen-dim/60 p-5">
      <div className="mb-3 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-cocoa/50">
        <span className="flex items-center gap-1.5">
          <Mic className="h-3.5 w-3.5" strokeWidth={2} />
          Voice note attached
        </span>
        <button type="button" onClick={onRemove} aria-label="Remove recording" className="text-cocoa/50 hover:text-red-600">
          <Trash2 className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-ember text-ember transition hover:bg-ember/10"
        >
          {isPlaying ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="ml-0.5 h-4 w-4" fill="currentColor" />}
        </button>
        <div className="h-8 flex-1 rounded-full bg-ember/15" aria-hidden="true" />
        <span className="flex-shrink-0 text-sm text-cocoa/60">{formatDuration(result.durationSeconds)}</span>
      </div>
      <audio
        ref={audioRef}
        src={result.url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  )
}
