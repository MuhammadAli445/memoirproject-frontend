import { useEffect, useState } from 'react'
import { ONBOARDING_STORAGE_KEY } from '../features/onboarding/state/onboarding-context'
import type { OnboardingState } from '../features/onboarding/types/onboarding.types'

function readSnapshot(): OnboardingState | null {
  try {
    const stored = window.localStorage.getItem(ONBOARDING_STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored) as OnboardingState
  } catch {
    return null
  }
}

/** Reads the answers the user gave during onboarding (relationship, description, family hopes, etc.), independent of OnboardingProvider so it can be read from anywhere in the app. */
export function useOnboardingSnapshot(): OnboardingState | null {
  const [snapshot, setSnapshot] = useState<OnboardingState | null>(null)

  useEffect(() => {
    setSnapshot(readSnapshot())
  }, [])

  return snapshot
}
