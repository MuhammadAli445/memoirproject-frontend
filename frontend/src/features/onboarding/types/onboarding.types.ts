export type Mood =
  | "warm-nostalgic"
  | "celebratory"
  | "reflective"
  | "humorous"
  | "simple-timeless";

export interface MoodOption {
  id: Mood;
  label: string;
  description: string;
  /** CSS gradient used as a placeholder for the photo-backed preview; no photo assets exist in the repo yet. */
  gradient: string;
}

export interface OnboardingState {
  step: number;
  title: string;
  relationship: string;
  mood: Mood;
  description: string;
  birthDate: string;
  passingDate: string;
  familyHopes: string;
}

export const ONBOARDING_STEPS = [
  "begin",
  "identity",
  "feeling",
  "details",
  "preview",
  "ready",
  "account",
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];
