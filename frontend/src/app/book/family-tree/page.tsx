'use client'

import BookChrome from '@/components/book/BookChrome'
import FamilyTreeNode from '@/components/book/FamilyTreeNode'
import { useMemoirData } from '@/data/book'

export default function FamilyTreePage() {
  const { familyTree } = useMemoirData()
  const hasFamily = Boolean(familyTree.children && familyTree.children.length > 0)

  return (
    <BookChrome>
      <div className="min-h-[calc(100vh-7rem)] bg-book-surface-container-low px-6 py-16">
        <h1 className="text-center font-serif text-4xl font-bold text-book-on-surface">Family Tree</h1>
        <div className="mt-14 flex justify-center overflow-x-auto pb-4">
          <FamilyTreeNode node={familyTree} isRoot />
        </div>
        {!hasFamily && (
          <p className="mx-auto mt-8 max-w-sm text-center font-book-sans text-sm leading-relaxed text-book-on-surface-variant">
            This family tree will grow as you invite family and friends to contribute their own branch of the
            story.
          </p>
        )}
      </div>
    </BookChrome>
  )
}
