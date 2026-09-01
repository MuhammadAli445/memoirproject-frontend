import { useEffect, useRef, useState } from 'react'
import { Check, Loader2, Pause, Play, Square, Trash2 } from 'lucide-react'
import { useVoiceRecorder, type RecordingResult } from '../hooks/useVoiceRecorder'
import { formatDuration } from '../utils/format'
import { transcribeAudioBlob } from '../utils/speechToText'

interface RecordingOverlayProps {
  title: string
  bodyPreview: string
  onCancel: () => void
  onConfirm: (result: RecordingResult, transcribedText?: string) => void
  /** Top-bar "Save" shortcut — stops (if needed) and hands back whatever was captured, or null. */
  onSaveNow: (result: RecordingResult | null, transcribedText?: string) => void
}

export default function RecordingOverlay({ title, bodyPreview, onCancel, onConfirm, onSaveNow }: RecordingOverlayProps) {
  const recorder = useVoiceRecorder()
  const startedRef = useRef(false)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcribeError, setTranscribeError] = useState<string | null>(null)
  const previewAudioRef = useRef<HTMLAudioElement>(null)

  // Auto-start as soon as the overlay appears — matches tapping the mic in the composer.
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    recorder.start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDiscard = () => {
    recorder.discard()
    onCancel()
  }

  const handleStop = async () => {
    await recorder.stopAndReview()
  }

  const handleConfirm = async () => {
    const result = recorder.confirm()
    if (!result) return

    let text = ''
    if (result.blob) {
      setIsTranscribing(true)
      setTranscribeError(null)
      try {
        text = await transcribeAudioBlob(result.blob)
      } catch (err: any) {
        console.error('Transcription error:', err)
        setTranscribeError('Failed to convert speech to text, but recording was kept.')
      } finally {
        setIsTranscribing(false)
      }
    }
    onConfirm(result, text)
  }

  const handleSaveShortcut = async () => {
    let result: RecordingResult | null = null
    if (recorder.phase === 'recording') {
      await recorder.stopAndReview()
      result = recorder.confirm()
    } else if (recorder.phase === 'review') {
      result = recorder.confirm()
    }

    let text = ''
    if (result?.blob) {
      setIsTranscribing(true)
      try {
        text = await transcribeAudioBlob(result.blob)
      } catch (err) {
        console.error('Transcription error:', err)
      } finally {
        setIsTranscribing(false)
      }
    }
    onSaveNow(result, text)
  }

  const togglePreview = () => {
    if (!previewAudioRef.current) return
    if (isPreviewPlaying) previewAudioRef.current.pause()
    else previewAudioRef.current.play()
  }

  return (
    <div className="fixed inset-0 z-[60] flex animate-fadeIn flex-col bg-cream">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-charcoal/10 px-5 py-4">
        <button
          type="button"
          onClick={() => {
            recorder.reset()
            onCancel()
          }}
          className="text-charcoal/50 transition hover:text-charcoal"
          aria-label="Close"
        >
          <span className="text-xl leading-none">&times;</span>
        </button>
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-charcoal/50">New Memory</span>
        <button
          type="button"
          onClick={handleSaveShortcut}
          className="text-sm font-medium text-terracotta transition hover:text-terracotta-dark"
        >
          Save
        </button>
      </div>

      {/* Title + body preview */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 pt-8">
        <h2 className="font-display text-2xl text-charcoal">{title || 'Untitled memory'}</h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-charcoal/60">
          {bodyPreview || 'Keep talking — you can write or edit the rest after you stop recording.'}
        </p>

        {recorder.error && <p className="mt-4 text-sm text-red-600">{recorder.error}</p>}
      </div>

      {/* Bottom recording control bar */}
      <div className="border-t border-charcoal/10 bg-white px-6 pb-8 pt-6">
        <div className="mx-auto flex max-w-sm flex-col items-center gap-6">
          <span className="font-mono text-3xl tabular-nums text-charcoal">
            {formatDuration(recorder.elapsedSeconds)}
          </span>

          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={handleDiscard}
              className="flex h-11 w-11 items-center justify-center rounded-full text-charcoal/50 transition hover:bg-cream hover:text-charcoal"
              aria-label="Discard recording"
            >
              <Trash2 className="h-5 w-5" strokeWidth={1.75} />
            </button>

            {recorder.phase === 'review' ? (
              <button
                type="button"
                onClick={togglePreview}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-terracotta text-cream transition hover:bg-terracotta-dark"
                aria-label={isPreviewPlaying ? 'Pause preview' : 'Play preview'}
              >
                {isPreviewPlaying ? (
                  <Pause className="h-6 w-6" fill="currentColor" />
                ) : (
                  <Play className="ml-1 h-6 w-6" fill="currentColor" />
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStop}
                className="flex h-16 w-16 animate-recordPulse items-center justify-center rounded-full bg-terracotta text-cream transition hover:bg-terracotta-dark"
                aria-label="Stop recording"
              >
                <Square className="h-5 w-5" fill="currentColor" />
              </button>
            )}

            <button
              type="button"
              onClick={handleConfirm}
              disabled={recorder.phase !== 'review' || isTranscribing}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-terracotta transition hover:bg-cream disabled:cursor-not-allowed disabled:text-charcoal/30 disabled:hover:bg-cream"
              aria-label="Confirm recording"
            >
              {isTranscribing ? <Loader2 className="h-5 w-5 animate-spin text-terracotta" /> : <Check className="h-5 w-5" strokeWidth={2.25} />}
            </button>
          </div>

          <p className="text-xs text-charcoal/40">
            {isTranscribing
              ? 'Converting speech to text via AssemblyAI...'
              : recorder.phase === 'recording'
              ? 'Tap the square to stop.'
              : 'Listen back, then confirm or discard.'}
          </p>
          {transcribeError && <p className="text-xs text-red-500 font-medium">{transcribeError}</p>}
        </div>
      </div>

      {recorder.result && (
        <audio
          ref={previewAudioRef}
          src={recorder.result.url}
          onPlay={() => setIsPreviewPlaying(true)}
          onPause={() => setIsPreviewPlaying(false)}
          onEnded={() => setIsPreviewPlaying(false)}
          className="hidden"
        />
      )}
    </div>
  )
}
