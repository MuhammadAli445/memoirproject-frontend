import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { sampleMemories } from '../data/sampleMemories'
import type { Memory } from '../types'

interface MemoryContextValue {
  memories: Memory[]
  addMemory: (memory: Memory) => void
  updateMemory: (memory: Memory) => void
  removeMemory: (id: string) => void
}

const MemoryContext = createContext<MemoryContextValue | null>(null)

export function MemoryProvider({ children }: { children: ReactNode }) {
  const [memories, setMemories] = useState<Memory[]>(sampleMemories)

  const addMemory = useCallback((memory: Memory) => {
    setMemories((prev) => [memory, ...prev])
  }, [])

  const updateMemory = useCallback((memory: Memory) => {
    setMemories((prev) => prev.map((m) => (m.id === memory.id ? memory : m)))
  }, [])

  const removeMemory = useCallback((id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id))
  }, [])

  return (
    <MemoryContext.Provider value={{ memories, addMemory, updateMemory, removeMemory }}>
      {children}
    </MemoryContext.Provider>
  )
}

export function useMemories() {
  const ctx = useContext(MemoryContext)
  if (!ctx) throw new Error('useMemories must be used within a MemoryProvider')
  return ctx
}
