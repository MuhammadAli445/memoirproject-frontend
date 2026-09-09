"use client";

interface StepHeaderProps {
  totalSteps: number;
  currentStep: number;
  onBack?: () => void;
  onClose?: () => void;
}

export function StepHeader({
  totalSteps,
  currentStep,
  onBack,
  onClose,
}: StepHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-5">
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back to the previous step"
        className="flex h-11 w-11 items-center justify-center rounded-full text-charcoal/60 transition-colors hover:bg-charcoal/5 hover:text-charcoal disabled:pointer-events-none disabled:opacity-0"
        disabled={!onBack}
      >
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M12.5 15.5 6.5 10l6-5.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="flex flex-col items-center gap-1.5">
        <div
          className="flex items-center gap-2"
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
        >
          {Array.from({ length: totalSteps }, (_, i) => (
            <span
              key={i}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                i < currentStep ? "bg-terracotta" : "bg-charcoal/15"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-charcoal/50">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close and finish this later"
        className="flex h-11 w-11 items-center justify-center rounded-full text-charcoal/60 transition-colors hover:bg-charcoal/5 hover:text-charcoal disabled:pointer-events-none disabled:opacity-0"
        disabled={!onClose}
      >
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path
            d="M4 4l10 10M14 4 4 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </header>
  );
}
