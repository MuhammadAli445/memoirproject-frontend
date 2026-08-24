"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import type { Mood, OnboardingState } from "../types/onboarding.types";

const STORAGE_KEY = "memoir-onboarding-state";

const initialState: OnboardingState = {
  step: 0,
  title: "",
  relationship: "",
  mood: "warm-nostalgic",
  description: "",
  birthDate: "",
  passingDate: "",
  familyHopes: "",
};

type Action =
  | { type: "SET_STEP"; step: number }
  | { type: "SET_TITLE"; title: string }
  | { type: "SET_RELATIONSHIP"; relationship: string }
  | { type: "SET_MOOD"; mood: Mood }
  | { type: "SET_DESCRIPTION"; description: string }
  | { type: "SET_BIRTH_DATE"; birthDate: string }
  | { type: "SET_PASSING_DATE"; passingDate: string }
  | { type: "SET_FAMILY_HOPES"; familyHopes: string }
  | { type: "HYDRATE"; state: OnboardingState }
  | { type: "RESET" };

function reducer(state: OnboardingState, action: Action): OnboardingState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step };
    case "SET_TITLE":
      return { ...state, title: action.title };
    case "SET_RELATIONSHIP":
      return { ...state, relationship: action.relationship };
    case "SET_MOOD":
      return { ...state, mood: action.mood };
    case "SET_DESCRIPTION":
      return { ...state, description: action.description };
    case "SET_BIRTH_DATE":
      return { ...state, birthDate: action.birthDate };
    case "SET_PASSING_DATE":
      return { ...state, passingDate: action.passingDate };
    case "SET_FAMILY_HOPES":
      return { ...state, familyHopes: action.familyHopes };
    case "HYDRATE":
      return action.state;
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

interface OnboardingContextValue {
  state: OnboardingState;
  setStep: (step: number) => void;
  setTitle: (title: string) => void;
  setRelationship: (relationship: string) => void;
  setMood: (mood: Mood) => void;
  setDescription: (description: string) => void;
  setBirthDate: (birthDate: string) => void;
  setPassingDate: (passingDate: string) => void;
  setFamilyHopes: (familyHopes: string) => void;
  reset: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        dispatch({ type: "HYDRATE", state: JSON.parse(stored) });
      } catch {
        // Ignore malformed/stale local storage payloads.
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value: OnboardingContextValue = {
    state,
    setStep: (step) => dispatch({ type: "SET_STEP", step }),
    setTitle: (title) => dispatch({ type: "SET_TITLE", title }),
    setRelationship: (relationship) =>
      dispatch({ type: "SET_RELATIONSHIP", relationship }),
    setMood: (mood) => dispatch({ type: "SET_MOOD", mood }),
    setDescription: (description) =>
      dispatch({ type: "SET_DESCRIPTION", description }),
    setBirthDate: (birthDate) => dispatch({ type: "SET_BIRTH_DATE", birthDate }),
    setPassingDate: (passingDate) =>
      dispatch({ type: "SET_PASSING_DATE", passingDate }),
    setFamilyHopes: (familyHopes) =>
      dispatch({ type: "SET_FAMILY_HOPES", familyHopes }),
    reset: () => {
      window.localStorage.removeItem(STORAGE_KEY);
      dispatch({ type: "RESET" });
    },
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return ctx;
}
