'use client'

import { X } from 'lucide-react'
import TocList from './TocList'

export default function TocDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed inset-0 z-50 transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-book-inverse-surface/40 transition-opacity ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        className={`absolute left-0 top-0 h-full w-[320px] max-w-[85vw] bg-book-surface-container-low p-6 shadow-xl transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute right-4 top-4 rounded-full p-1.5 text-book-on-surface-variant transition hover:bg-book-on-surface/5"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>
        <TocList onNavigate={onClose} />
      </div>
    </div>
  )
}
