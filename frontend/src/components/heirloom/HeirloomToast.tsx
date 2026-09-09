'use client'

import { useCallback, useRef, useState } from 'react'
import { CheckCircle2, X, type LucideIcon } from 'lucide-react'

interface ToastState {
  message: string
  icon: LucideIcon
  visible: boolean
}

const TOAST_DURATION_MS = 6000

export function useHeirloomToast() {
  const [toast, setToast] = useState<ToastState>({ message: '', icon: CheckCircle2, visible: false })
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hideToast = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setToast((t) => ({ ...t, visible: false }))
  }, [])

  const showToast = useCallback((message: string, icon: LucideIcon = CheckCircle2) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setToast({ message, icon, visible: true })
    timeoutRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }))
    }, TOAST_DURATION_MS)
  }, [])

  return { toast, showToast, hideToast }
}

export function HeirloomToast({
  toast,
  onDismiss,
}: {
  toast: ReturnType<typeof useHeirloomToast>['toast']
  onDismiss?: () => void
}) {
  const Icon = toast.icon
  return (
    <div
      role="status"
      className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 rounded-2xl bg-heirloom-inverse-surface py-4 pl-5 pr-4 font-heirloom-sans text-base text-heirloom-inverse-on-surface shadow-2xl transition-all duration-300 ${
        toast.visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <Icon className="h-5 w-5 shrink-0 text-heirloom-gold-accent" strokeWidth={2} />
      <span>{toast.message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-heirloom-inverse-on-surface/70 transition hover:bg-white/10 hover:text-heirloom-inverse-on-surface"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      )}
    </div>
  )
}
