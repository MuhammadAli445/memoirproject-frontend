"use client";

import { MemoirPreviewCard } from "../components/MemoirPreviewCard";
import { ActionRow } from "../components/ActionRow";
import { useOnboarding } from "../state/onboarding-context";

interface CreateIdentityProps {
  onBack: () => void;
  onContinue: () => void;
}

export function CreateIdentity({ onBack, onContinue }: CreateIdentityProps) {
  const { state, setTitle, setRelationship } = useOnboarding();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 py-10">
      <h1 className="font-serif text-3xl text-charcoal">Create the Identity</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-charcoal/60">
        Let&apos;s give this collection a name and define your connection to
        the storyteller.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-start">
        <div className="flex flex-col gap-6">
          <label className="flex flex-col gap-2 text-sm font-medium text-charcoal">
            What would you like to call this memoir?
            <input
              type="text"
              value={state.title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The Story of Grandma Ayesha"
              className="rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm font-normal text-charcoal placeholder:text-charcoal/35 focus:border-terracotta focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-charcoal">
            How would you describe your relationship with them?
            <input
              type="text"
              value={state.relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="My grandmother"
              className="rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm font-normal text-charcoal placeholder:text-charcoal/35 focus:border-terracotta focus:outline-none"
            />
          </label>
        </div>

        <MemoirPreviewCard
          variant="live"
          title={state.title}
          relationship={state.relationship}
        />
      </div>

      <div className="mt-12">
        <ActionRow
          primary={{ label: "Continue", onClick: onContinue }}
          secondary={{ label: "Back", onClick: onBack, variant: "outline" }}
        />
      </div>
    </div>
  );
}
