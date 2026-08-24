"use client";

import { MemoirPreviewCard } from "../components/MemoirPreviewCard";
import { ActionRow } from "../components/ActionRow";
import { useOnboarding } from "../state/onboarding-context";

interface FinalPreviewProps {
  onEdit: () => void;
  onLooksGood: () => void;
}

export function FinalPreview({ onEdit, onLooksGood }: FinalPreviewProps) {
  const { state } = useOnboarding();
  const establishedYear = state.birthDate
    ? String(new Date(state.birthDate).getFullYear())
    : null;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <h1 className="font-serif text-3xl text-charcoal">
        This is the beginning of your family&apos;s memoir.
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-charcoal/60">
        A preview of how your collection will look. The tactile legacy
        begins here.
      </p>

      <div className="mt-10">
        <MemoirPreviewCard
          variant="cover"
          title={state.title}
          establishedYear={establishedYear}
        />
      </div>

      <div className="mt-10">
        <ActionRow
          primary={{ label: "Looks good", onClick: onLooksGood }}
          secondary={{ label: "Edit details", onClick: onEdit, variant: "outline" }}
        />
      </div>
    </div>
  );
}
