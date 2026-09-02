"use client";

import { useRouter } from "next/navigation";
import { OnboardingProvider, useOnboarding } from "./state/onboarding-context";
import { StepHeader } from "./components/StepHeader";
import { BeginIntro } from "./screens/BeginIntro";
import { CreateIdentity } from "./screens/CreateIdentity";
import { AddDetails } from "./screens/AddDetails";
import { FinalPreview } from "./screens/FinalPreview";
import { MemoirReady } from "./screens/MemoirReady";
import { CreateAccount } from "./screens/CreateAccount";

const TOTAL_STEPS = 5;

const STEP_DOTS = [1, 2, 3, 4, 5];

function OnboardingFlowInner() {
  const router = useRouter();
  const { state, setStep, reset } = useOnboarding();
  const step = state.step;

  const goTo = (next: number) => setStep(next);

  const header = step <= 3 && (
    <StepHeader
      totalSteps={TOTAL_STEPS}
      currentStep={STEP_DOTS[step]}
      onBack={step > 0 ? () => goTo(step - 1) : undefined}
      onClose={() => router.push("/login")}
    />
  );

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {header}
      {step === 0 && (
        <BeginIntro
          onBegin={() => goTo(1)}
          onSkip={() => router.push("/login")}
        />
      )}
      {step === 1 && (
        <CreateIdentity onBack={() => goTo(0)} onContinue={() => goTo(2)} />
      )}
      {step === 2 && (
        <AddDetails
          onBack={() => goTo(1)}
          onSkip={() => goTo(3)}
          onContinue={() => goTo(3)}
        />
      )}
      {step === 3 && (
        <FinalPreview onEdit={() => goTo(2)} onLooksGood={() => goTo(4)} />
      )}
      {step === 4 && (
        <MemoirReady
          onGoToMemoir={() => goTo(5)}
          onInviteLater={() => goTo(5)}
        />
      )}
      {step === 5 && (
        <CreateAccount
          onBack={() => goTo(4)}
          onClose={() => router.push("/login")}
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
