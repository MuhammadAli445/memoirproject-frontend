'use client'

import BookChrome from '@/components/book/BookChrome'
import FamilyTreeNode from '@/components/book/FamilyTreeNode'
import { familyTree } from '@/data/book'

export default function FamilyTreePage() {
  return (
    <BookChrome>
      <div className="min-h-[calc(100vh-7rem)] bg-book-surface-container-low px-6 py-16">
        <h1 className="text-center font-serif text-4xl font-bold text-book-on-surface">Family Tree</h1>
        <div className="mt-14 flex justify-center overflow-x-auto pb-4">
          <FamilyTreeNode node={familyTree} isRoot />
        </div>
      </div>
    </BookChrome>
  )
}
