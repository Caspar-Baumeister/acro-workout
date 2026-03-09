'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useQuestionnaire } from './use-questionnaire';
import { ProgressBar } from './progress-bar';
import { StepNavigation } from './step-navigation';
import { StepContainer } from './step-container';
import {
  AcrobaticsTypeStep,
  RoleStep,
  LevelStep,
  AcroStyleStep,
  ScheduleStep,
  SetupStep,
  LimitationsStep,
  EmailStep,
} from './steps';

export function QuestionnaireFlow() {
  const router = useRouter();
  const {
    data,
    currentStep,
    direction,
    totalSteps,
    isSubmitting,
    submitError,
    updateData,
    goToNextStep,
    goToPrevStep,
    canProceed,
    setSubmitting,
    setSubmitError,
  } = useQuestionnaire();

  const handleSubmit = async () => {
    if (!canProceed(currentStep)) return;
    
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionnaire: data }),
      });

      const result = await response.json();

      // New API format: { ok: true } or { ok: false, code, message }
      if (!result.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      // Success! Redirect to success page
      router.push('/success');
    } catch (error) {
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred. Please try again.'
      );
    }
  };

  const renderStep = () => {
    const props = { data, onUpdate: updateData };

    switch (currentStep) {
      case 0:
        return <AcrobaticsTypeStep {...props} />;
      case 1:
        return <RoleStep {...props} />;
      case 2:
        return <LevelStep {...props} />;
      case 3:
        return <AcroStyleStep {...props} />;
      case 4:
        return <ScheduleStep {...props} />;
      case 5:
        return <SetupStep {...props} />;
      case 6:
        return <LimitationsStep {...props} />;
      case 7:
        return <EmailStep {...props} submitError={submitError} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      
      <motion.div
        className="bg-card rounded-2xl border border-border/50 p-6 sm:p-8 shadow-xl shadow-black/5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <StepContainer stepKey={currentStep} direction={direction}>
          {renderStep()}
        </StepContainer>

        <StepNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          canProceed={canProceed(currentStep)}
          isSubmitting={isSubmitting}
          onBack={goToPrevStep}
          onNext={goToNextStep}
          onSubmit={handleSubmit}
        />
      </motion.div>
    </div>
  );
}
