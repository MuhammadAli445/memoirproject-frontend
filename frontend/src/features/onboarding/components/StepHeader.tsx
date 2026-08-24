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
    <header className="flex items-center justify-between px-6 py-5">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className="text-charcoal/60 transition-colors hover:text-charcoal disabled:opacity-0"
        disabled={!onBack}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M12.5 15.5 6.5 10l6-5.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="flex items-center gap-2" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              i < currentStep ? "bg-terracotta" : "bg-charcoal/15"
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="text-charcoal/60 transition-colors hover:text-charcoal disabled:opacity-0"
        disabled={!onClose}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
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
