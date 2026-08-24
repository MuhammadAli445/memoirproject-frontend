"use client";

import { ActionRow } from "../components/ActionRow";
import { useOnboarding } from "../state/onboarding-context";

interface AddDetailsProps {
  onSkip: () => void;
  onContinue: () => void;
}

export function AddDetails({ onSkip, onContinue }: AddDetailsProps) {
  const { state, setDescription, setBirthDate, setPassingDate, setFamilyHopes } =
    useOnboarding();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-10">
      <h1 className="font-serif text-3xl text-charcoal">Add More Details</h1>
      <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
        You can skip anything you are not ready to add. These details help
        us build a richer context for the memoir.
      </p>

      <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-charcoal/10 bg-white p-6">
        <label className="flex flex-col gap-2 text-sm font-medium text-charcoal">
          Short Description
          <textarea
            value={state.description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief note about their life or legacy…"
            rows={3}
            className="resize-none rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm font-normal text-charcoal placeholder:text-charcoal/35 focus:border-terracotta focus:outline-none"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-charcoal">
            Birth Date
            <input
              type="date"
              value={state.birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              placeholder="mm/dd/yyyy"
              className="rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm font-normal text-charcoal focus:border-terracotta focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-charcoal">
            Passing Date <span className="font-normal text-charcoal/40">(Optional)</span>
            <input
              type="date"
              value={state.passingDate}
              onChange={(e) => setPassingDate(e.target.value)}
              placeholder="mm/dd/yyyy"
              className="rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm font-normal text-charcoal focus:border-terracotta focus:outline-none"
            />
          </label>
        </div>

        <hr className="border-charcoal/10" />

        <label className="flex flex-col gap-2 text-sm font-medium text-charcoal">
          What does the family hope to preserve?
          <textarea
            value={state.familyHopes}
            onChange={(e) => setFamilyHopes(e.target.value)}
            placeholder="Stories of their travels, lessons they taught, recipes…"
            rows={3}
            className="resize-none rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm font-normal text-charcoal placeholder:text-charcoal/35 focus:border-terracotta focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-10">
        <ActionRow
          primary={{ label: "Continue", onClick: onContinue }}
          secondary={{ label: "Skip for now", onClick: onSkip, variant: "link" }}
        />
      </div>
    </div>
  );
}
