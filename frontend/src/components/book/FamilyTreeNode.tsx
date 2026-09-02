import Link from 'next/link'
import type { FamilyTreeNode as FamilyTreeNodeType } from '@/data/book'

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function FamilyTreeNode({ node, isRoot = false }: { node: FamilyTreeNodeType; isRoot?: boolean }) {
  const content = (
    <div className="flex flex-col items-center">
      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-4 border-book-surface-container-lowest bg-book-secondary-container font-serif text-xl text-book-on-secondary-container shadow-md">
        {initials(node.name)}
      </div>
      <p className="mt-2 font-book-sans text-sm font-medium text-book-on-surface">{node.name}</p>
    </div>
  )

  return (
    <div className="flex flex-col items-center">
      {isRoot ? (
        content
      ) : (
        <Link href="/book/family-tree" className="transition hover:opacity-80">
          {content}
        </Link>
      )}

      {node.children && node.children.length > 0 && (
        <>
          <div className="h-8 w-px bg-book-primary/35" />
          <div className="relative flex">
            {node.children.length > 1 && <div className="absolute left-12 right-12 top-0 h-px bg-book-primary/35" />}
            {node.children.map((child) => (
              <div key={child.name} className="flex flex-col items-center px-6">
                <div className="h-8 w-px bg-book-primary/35" />
                <FamilyTreeNode node={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
