import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BackButtonProps {
  /** Explicit route to navigate to. Defaults to browser back (-1). */
  to?: string
  className?: string
}

export default function BackButton({ to, className = '' }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (to) router.push(to)
    else router.back()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 text-sm text-charcoal/50 transition hover:text-charcoal ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4" strokeWidth={2} />
      Back
    </button>
  )
}
