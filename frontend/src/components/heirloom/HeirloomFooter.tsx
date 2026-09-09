import Link from 'next/link'

export default function HeirloomFooter() {
  return (
    <footer className="w-full shrink-0 border-t border-heirloom-border bg-heirloom-bg-page py-4">
      <div className="mx-auto flex max-w-[1560px] flex-col items-center justify-between gap-2 px-8 text-sm text-heirloom-text-tertiary sm:flex-row">
        <p className="font-heirloom-serif text-sm italic text-heirloom-text-secondary">
          Preserving generational memories with quiet dignity.
        </p>
        <div className="flex items-center gap-6 font-heirloom-sans text-sm font-medium">
          <Link href="#" className="transition-colors hover:text-heirloom-primary">
            About
          </Link>
          <Link href="#" className="transition-colors hover:text-heirloom-primary">
            Privacy
          </Link>
          <span>© The Memoir Project</span>
        </div>
      </div>
    </footer>
  )
}
