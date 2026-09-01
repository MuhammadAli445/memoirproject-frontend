import { useCallback, useEffect, useRef, useState } from 'react'

export interface RecordingResult {
  url: string
  durationSeconds: number
  blob: Blob
}

export type RecordingPhase = 'idle' | 'recording' | 'review'

interface UseVoiceRecorder {
  phase: RecordingPhase
  elapsedSeconds: number
  error: string | null
  result: RecordingResult | null
  /** Ask for microphone access and start capturing audio. */
  start: () => Promise<void>
  /** Stop capturing audio and move to the review phase (doesn't discard). */
  stopAndReview: () => Promise<void>
  /** Throw away whatever was captured and return to idle. */
  discard: () => void
  /** Accept the reviewed recording — caller reads `result` after this. */
  confirm: () => RecordingResult | null
  /** Reset everything back to idle (e.g. when the composer closes). */
  reset: () => void
}

const MAX_SECONDS = 10 * 60 // PRD cap: voice notes up to 10 minutes

/**
 * Wraps MediaRecorder into the three-step flow shown in the design: tap to
 * record -> stop -> review (discard or confirm). Requires localhost or
 * https:// — browsers block microphone access on plain http.
 */
export function useVoiceRecorder(): UseVoiceRecorder {
  const [phase, setPhase] = useState<RecordingPhase>('idle')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<RecordingResult | null>(null)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<number | null>(null)

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const releaseStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }

  useEffect(() => releaseStream, [])

  const start = useCallback(async () => {
    setError(null)
    setResult(null)
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('This browser does not support in-browser recording.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []

      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }
      recorder.start()
      recorderRef.current = recorder

      setPhase('recording')
      setElapsedSeconds(0)
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev + 1 >= MAX_SECONDS) {
            recorder.stop()
            return MAX_SECONDS
          }
          return prev + 1
        })
      }, 1000)
    } catch {
      setError('Microphone access was denied or is unavailable.')
    }
  }, [])

  const stopAndReview = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      const recorder = recorderRef.current
      if (!recorder || recorder.state === 'inactive') {
        resolve()
        return
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        clearTimer()
        releaseStream()
        setResult({ url, durationSeconds: elapsedSeconds, blob })
        setPhase('review')
        resolve()
      }
      recorder.stop()
    })
  }, [elapsedSeconds])

  const discard = useCallback(() => {
    const recorder = recorderRef.current
    if (recorder && recorder.state !== 'inactive') recorder.stop()
    clearTimer()
    releaseStream()
    if (result?.url) URL.revokeObjectURL(result.url)
    setResult(null)
    setElapsedSeconds(0)
    setPhase('idle')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  const confirm = useCallback((): RecordingResult | null => {
    setPhase('idle')
    return result
  }, [result])

  const reset = useCallback(() => {
    clearTimer()
    releaseStream()
    setPhase('idle')
    setElapsedSeconds(0)
    setResult(null)
    setError(null)
  }, [])

  return { phase, elapsedSeconds, error, result, start, stopAndReview, discard, confirm, reset }
}
