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

// Begin, Identity, Details, Preview, Ready, Account.
const TOTAL_STEPS = 6;

function OnboardingFlowInner() {
  const router = useRouter();
  const { state, setStep, reset } = useOnboarding();
  const step = state.step;

  const goTo = (next: number) => setStep(next);

  // Step 5 (CreateAccount) renders its own back/close controls, so the shared
  // header only shows progress there to avoid duplicate buttons.
  const header = (
    <StepHeader
      totalSteps={TOTAL_STEPS}
      currentStep={step + 1}
      onBack={step > 0 && step < 5 ? () => goTo(step - 1) : undefined}
      onClose={step < 5 ? () => router.push("/login") : undefined}
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
