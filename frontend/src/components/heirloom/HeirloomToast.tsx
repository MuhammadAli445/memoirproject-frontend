'use client'

import { useCallback, useRef, useState } from 'react'
import { CheckCircle2, type LucideIcon } from 'lucide-react'

interface ToastState {
  message: string
  icon: LucideIcon
  visible: boolean
}

export function useHeirloomToast() {
  const [toast, setToast] = useState<ToastState>({ message: '', icon: CheckCircle2, visible: false })
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((message: string, icon: LucideIcon = CheckCircle2) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setToast({ message, icon, visible: true })
    timeoutRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }))
    }, 3200)
  }, [])

  return { toast, showToast }
}

export function HeirloomToast({ toast }: { toast: ReturnType<typeof useHeirloomToast>['toast'] }) {
  const Icon = toast.icon
  return (
    <div
      className={`fixed bottom-8 right-8 z-50 flex items-center gap-2.5 rounded-full bg-heirloom-inverse-surface px-5 py-3 font-heirloom-sans text-xs text-heirloom-inverse-on-surface shadow-2xl transition-all duration-300 ${
        toast.visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <Icon className="h-[18px] w-[18px] text-heirloom-gold-accent" strokeWidth={2} />
      <span>{toast.message}</span>
    </div>
  )
}
