import { useEffect, useRef, useState } from 'react'
import { Check, Pause, Play, Square, Trash2 } from 'lucide-react'
import { useVoiceRecorder, type RecordingResult } from '../hooks/useVoiceRecorder'
import { formatDuration } from '../utils/format'

interface RecordingOverlayProps {
  title: string
  bodyPreview: string
  onCancel: () => void
  onConfirm: (result: RecordingResult) => void
  /** Top-bar "Save" shortcut — stops (if needed) and hands back whatever was captured, or null. */
  onSaveNow: (result: RecordingResult | null) => void
}

export default function RecordingOverlay({ title, bodyPreview, onCancel, onConfirm, onSaveNow }: RecordingOverlayProps) {
  const recorder = useVoiceRecorder()
  const startedRef = useRef(false)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
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

  const handleConfirm = () => {
    const result = recorder.confirm()
    if (result) onConfirm(result)
  }

  const handleSaveShortcut = async () => {
    if (recorder.phase === 'recording') {
      await recorder.stopAndReview()
      const result = recorder.confirm()
      onSaveNow(result)
    } else if (recorder.phase === 'review') {
      const result = recorder.confirm()
      onSaveNow(result)
    } else {
      onSaveNow(null)
    }
  }

  const togglePreview = () => {
    if (!previewAudioRef.current) return
    if (isPreviewPlaying) previewAudioRef.current.pause()
    else previewAudioRef.current.play()
  }

  return (
    <div className="fixed inset-0 z-[60] flex animate-fadeIn flex-col bg-ink">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-ink-600 px-5 py-4">
        <button
          type="button"
          onClick={() => {
            recorder.reset()
            onCancel()
          }}
          className="text-mist transition hover:text-linen"
          aria-label="Close"
        >
          <span className="text-xl leading-none">&times;</span>
        </button>
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-mist">New Memory</span>
        <button
          type="button"
          onClick={handleSaveShortcut}
          className="text-sm font-medium text-ember transition hover:text-ember-hover"
        >
          Save
        </button>
      </div>

      {/* Title + body preview */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 pt-8">
        <h2 className="font-display text-2xl text-linen">{title || 'Untitled memory'}</h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-mist">
          {bodyPreview || 'Keep talking — you can write or edit the rest after you stop recording.'}
        </p>

        {recorder.error && <p className="mt-4 text-sm text-red-400">{recorder.error}</p>}
      </div>

      {/* Bottom recording control bar */}
      <div className="border-t border-ink-600 bg-ink-800 px-6 pb-8 pt-6">
        <div className="mx-auto flex max-w-sm flex-col items-center gap-6">
          <span className="font-mono text-3xl tabular-nums text-linen">
            {formatDuration(recorder.elapsedSeconds)}
          </span>

          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={handleDiscard}
              className="flex h-11 w-11 items-center justify-center rounded-full text-mist transition hover:bg-ink-600 hover:text-linen"
              aria-label="Discard recording"
            >
              <Trash2 className="h-5 w-5" strokeWidth={1.75} />
            </button>

            {recorder.phase === 'review' ? (
              <button
                type="button"
                onClick={togglePreview}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-ember text-white transition hover:bg-ember-hover"
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
                className="flex h-16 w-16 animate-recordPulse items-center justify-center rounded-full bg-ember text-white transition hover:bg-ember-hover"
                aria-label="Stop recording"
              >
                <Square className="h-5 w-5" fill="currentColor" />
              </button>
            )}

            <button
              type="button"
              onClick={handleConfirm}
              disabled={recorder.phase !== 'review'}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-600 text-ember transition hover:bg-ink-700 disabled:cursor-not-allowed disabled:text-mist-dim disabled:hover:bg-ink-600"
              aria-label="Confirm recording"
            >
              <Check className="h-5 w-5" strokeWidth={2.25} />
            </button>
          </div>

          <p className="text-xs text-mist-dim">
            {recorder.phase === 'recording'
              ? 'Tap the square to stop.'
              : 'Listen back, then confirm or discard.'}
          </p>
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
