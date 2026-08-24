"use client";

import type { MoodOption } from "../types/onboarding.types";
import { useOnboarding } from "../state/onboarding-context";

const MOOD_OPTIONS: MoodOption[] = [
  {
    id: "warm-nostalgic",
    label: "Warm and nostalgic",
    description: "Soft tones, vintage touches, emotional resonance.",
    gradient: "linear-gradient(160deg, #E8C9A8 0%, #C2683D 100%)",
  },
  {
    id: "celebratory",
    label: "Celebratory",
    description: "Bright colors, joyous moments, uplifting energy.",
    gradient: "linear-gradient(160deg, #F6D77A 0%, #E08E45 100%)",
  },
  {
    id: "reflective",
    label: "Reflective",
    description: "Quiet focus, deep thoughts, serene presentation.",
    gradient: "linear-gradient(160deg, #B7C4C2 0%, #5C6B68 100%)",
  },
  {
    id: "humorous",
    label: "Humorous",
    description: "Lighthearted, playful accents, joyful memories.",
    gradient: "linear-gradient(160deg, #F2A6A0 0%, #D97862 100%)",
  },
  {
    id: "simple-timeless",
    label: "Simple and timeless",
    description: "Clean lines, elegant typography, minimal distraction.",
    gradient: "linear-gradient(160deg, #EDE7DD 0%, #B7A98F 100%)",
  },
];

interface ChooseFeelingProps {
  onContinue: () => void;
}

export function ChooseFeeling({ onContinue }: ChooseFeelingProps) {
  const { state, setMood } = useOnboarding();
  const selected = MOOD_OPTIONS.find((m) => m.id === state.mood) ?? MOOD_OPTIONS[0];
  const currentMood = state.mood;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 py-10">
      <h1 className="font-serif text-3xl text-charcoal">
        How should this memoir feel?
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-charcoal/60">
        Select a mood to help us tailor the visual style, prompts, and
        overall tone of your digital heirloom.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-start">
        <div role="radiogroup" aria-label="Memoir mood" className="flex flex-col gap-3">
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = mood.id === currentMood;
            return (
              <button
                key={mood.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setMood(mood.id)}
                className={`flex items-start justify-between gap-4 rounded-xl border px-5 py-4 text-left transition-colors ${
                  isSelected
                    ? "border-terracotta bg-white"
                    : "border-charcoal/10 bg-white/60 hover:border-charcoal/20"
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-charcoal">{mood.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-charcoal/55">
                    {mood.description}
                  </p>
                </div>
                {isSelected && (
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracotta text-cream">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path
                        d="M1.5 5.2 3.8 7.5 8.5 2.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          <div
            className="relative flex aspect-[4/5] w-full flex-col justify-end overflow-hidden rounded-2xl p-6 text-cream"
            style={{ background: selected.gradient }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
            <div className="relative">
              <p className="font-serif text-xl">{selected.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-cream/85">
                {selected.description}
              </p>
            </div>
          </div>
          <p className="text-center text-xs uppercase tracking-widest text-charcoal/40">
            Style Preview
          </p>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center gap-2 rounded-full bg-terracotta px-8 py-3 text-sm font-medium text-cream transition-colors hover:bg-terracotta-dark"
        >
          Continue to Content
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
