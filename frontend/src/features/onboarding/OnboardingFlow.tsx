"use client";

import { useRouter } from "next/navigation";
import { OnboardingProvider, useOnboarding } from "./state/onboarding-context";
import { StepHeader } from "./components/StepHeader";
import { BeginIntro } from "./screens/BeginIntro";
import { CreateIdentity } from "./screens/CreateIdentity";
import { ChooseFeeling } from "./screens/ChooseFeeling";
import { AddDetails } from "./screens/AddDetails";
import { FinalPreview } from "./screens/FinalPreview";
import { MemoirReady } from "./screens/MemoirReady";
import { CreateAccount } from "./screens/CreateAccount";

const TOTAL_STEPS = 6;

// Filled-dot position per screen, as given explicitly in the design spec
// (screens 4-8 share a 6-dot stepper, but the count jumps 1 -> 3 between
// screens 4 and 5 in the source screenshots — that's the spec, not a bug).
const STEP_DOTS = [1, 3, 4, 5, 6];

function OnboardingFlowInner() {
  const router = useRouter();
  const { state, setStep, reset } = useOnboarding();
  const step = state.step;

  const goTo = (next: number) => setStep(next);

  const header = step <= 4 && (
    <StepHeader
      totalSteps={TOTAL_STEPS}
      currentStep={STEP_DOTS[step]}
      onBack={step > 0 ? () => goTo(step - 1) : undefined}
      onClose={() => router.push("/dashboard")}
    />
  );

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {header}
      {step === 0 && (
        <BeginIntro
          onBegin={() => goTo(1)}
          onSkip={() => router.push("/dashboard")}
        />
      )}
      {step === 1 && (
        <CreateIdentity onBack={() => goTo(0)} onContinue={() => goTo(2)} />
      )}
      {step === 2 && <ChooseFeeling onContinue={() => goTo(3)} />}
      {step === 3 && (
        <AddDetails onSkip={() => goTo(4)} onContinue={() => goTo(4)} />
      )}
      {step === 4 && (
        <FinalPreview onEdit={() => goTo(3)} onLooksGood={() => goTo(5)} />
      )}
      {step === 5 && (
        <MemoirReady
          onGoToMemoir={() => router.push("/dashboard")}
          onInviteLater={() => router.push("/dashboard")}
        />
      )}
      {step === 6 && (
        <CreateAccount
          onBack={() => goTo(5)}
          onClose={() => router.push("/dashboard")}
          onCreateAccount={() => {
            // Signup already succeeded and stored session tokens;
            // clear the anonymous onboarding state and continue.
            reset();
            router.push("/dashboard");
          }}
        />
      )}
    </div>
  );
}

export function OnboardingFlow() {
  return (
    <OnboardingProvider>
      <OnboardingFlowInner />
    </OnboardingProvider>
  );
}
