import { useEffect, useState } from 'react'
import { ONBOARDING_STORAGE_KEY } from '../features/onboarding/state/onboarding-context'
import type { Subject } from '../types'

export const DEFAULT_SUBJECT: Subject = { name: 'Untitled Memoir' }

function yearFrom(dateString: string): number | undefined {
  if (!dateString) return undefined
  const year = new Date(dateString).getFullYear()
  return Number.isNaN(year) ? undefined : year
}

function readStoredSubject(): Subject {
  try {
    const stored = window.localStorage.getItem(ONBOARDING_STORAGE_KEY)
    if (!stored) return DEFAULT_SUBJECT

    const parsed = JSON.parse(stored) as {
      title?: string
      birthDate?: string
      passingDate?: string
    }

    const name = parsed.title?.trim() || DEFAULT_SUBJECT.name

    return {
      name,
      birthYear: parsed.birthDate ? yearFrom(parsed.birthDate) : undefined,
      deathYear: parsed.passingDate ? yearFrom(parsed.passingDate) : undefined,
    }
  } catch {
    return DEFAULT_SUBJECT
  }
}

/** Reads the memoir title/dates the user entered during onboarding (falls back to a neutral placeholder). */
export function useSubject(): Subject {
  const [subject, setSubject] = useState<Subject>(DEFAULT_SUBJECT)

  useEffect(() => {
    setSubject(readStoredSubject())
  }, [])

  return subject
}
