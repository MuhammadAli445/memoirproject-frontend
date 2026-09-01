"use client";

import { useState } from "react";
import { ActionRow } from "../components/ActionRow";
import { AudioRecorder } from "../components/AudioRecorder";
import { useOnboarding } from "../state/onboarding-context";

interface AddDetailsProps {
  onBack?: () => void;
  onSkip?: () => void;
  onContinue: () => void;
}

export function AddDetails({ onBack, onSkip, onContinue }: AddDetailsProps) {
  const [subStep, setSubStep] = useState<1 | 2 | 3>(1);
  const { state, setDescription, setBirthDate, setPassingDate, setFamilyHopes } =
    useOnboarding();

  const handleBack = () => {
    if (subStep === 1) {
      if (onBack) {
        onBack();
      }
    } else {
      setSubStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-10">
      <div className="rounded-2xl border border-charcoal/10 bg-white p-8 shadow-sm">
        {subStep === 1 && (
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#F5EBE1]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2l1.8 5.6L19.5 9l-5.7 1.4L12 16l-1.8-5.6L4.5 9l5.7-1.4L12 2ZM19 15l.9 2.8L22.5 18l-2.6.7L19 21.5l-.9-2.8L15.5 18l2.6-.7L19 15Z"
                  fill="#C2683D"
                />
              </svg>
            </div>

            <h1 className="font-serif text-3xl text-charcoal">
              Tell us who they were
            </h1>
            <p className="mt-2 text-sm text-charcoal/60">
              You can skip anything you&apos;re not ready to add.
            </p>

            <div className="mt-8 w-full text-left flex flex-col gap-3">
              <label className="flex flex-col gap-2 text-sm font-medium text-charcoal">
                Short Description
                <textarea
                  value={state.description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A brief note about their life or legacy…"
                  rows={4}
                  className="resize-none rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm font-normal text-charcoal placeholder:text-charcoal/35 focus:border-terracotta focus:outline-none"
                />
              </label>

              <AudioRecorder
                onTranscribed={(text) =>
                  setDescription(state.description ? `${state.description} ${text}` : text)
                }
              />
            </div>

            <div className="mt-8 w-full">
              <ActionRow
                align="space-between"
                secondary={{
                  label: "← Back",
                  onClick: handleBack,
                  variant: "link",
                }}
                primary={{
                  label: "Continue",
                  onClick: () => setSubStep(2),
                }}
              />
            </div>
          </div>
        )}

        {subStep === 2 && (
          <div className="flex flex-col items-center text-center">
            <h1 className="font-serif text-3xl text-charcoal">
              When they lived
            </h1>
            <p className="mt-2 text-sm text-charcoal/60">
              You can skip anything you&apos;re not ready to add.
            </p>

            <div className="mt-8 grid w-full gap-4 text-left sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-charcoal">
                Birth Date *
                <input
                  type="date"
                  value={state.birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  placeholder="DD / MM / YYYY"
                  className="rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm font-normal text-charcoal focus:border-terracotta focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-charcoal">
                Passing Date <span className="font-normal text-charcoal/40">(Optional)</span>
                <input
                  type="date"
                  value={state.passingDate}
                  onChange={(e) => setPassingDate(e.target.value)}
                  placeholder="DD / MM / YYYY"
                  className="rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm font-normal text-charcoal focus:border-terracotta focus:outline-none"
                />
              </label>
            </div>

            <div className="mt-8 w-full">
              <ActionRow
                align="space-between"
                secondary={{
                  label: "← Back",
                  onClick: handleBack,
                  variant: "link",
                }}
                primary={{
                  label: "Continue",
                  onClick: () => setSubStep(3),
                }}
              />
            </div>
          </div>
        )}

        {subStep === 3 && (
          <div className="flex flex-col items-center text-center">
            <h1 className="font-serif text-3xl text-charcoal">
              What should we remember?
            </h1>
            <p className="mt-2 text-sm text-charcoal/60">
              You can skip anything you&apos;re not ready to add.
            </p>

            <div className="mt-8 w-full text-left flex flex-col gap-3">
              <textarea
                value={state.familyHopes}
                onChange={(e) => setFamilyHopes(e.target.value)}
                placeholder="Stories of their travels, lessons they taught, recipes…"
                rows={5}
                className="resize-none rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm font-normal text-charcoal placeholder:text-charcoal/35 focus:border-terracotta focus:outline-none"
              />

              <AudioRecorder
                onTranscribed={(text) =>
                  setFamilyHopes(state.familyHopes ? `${state.familyHopes} ${text}` : text)
                }
              />
            </div>

            <div className="mt-8 w-full">
              <ActionRow
                align="space-between"
                secondary={{
                  label: "← Back",
                  onClick: handleBack,
                  variant: "link",
                }}
                primary={{
                  label: "Finish",
                  onClick: onContinue,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
