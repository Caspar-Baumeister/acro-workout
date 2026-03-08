'use client';

import { useState, useCallback } from 'react';
import type { QuestionnaireInput } from '@/lib/validation';

export type PartialQuestionnaire = Partial<QuestionnaireInput>;

export interface QuestionnaireState {
  data: PartialQuestionnaire;
  currentStep: number;
  direction: 'forward' | 'backward';
  isSubmitting: boolean;
  submitError: string | null;
}

const TOTAL_STEPS = 8;

const initialData: PartialQuestionnaire = {
  acrobaticsType: undefined,
  role: undefined,
  level: undefined,
  goals: [],
  trainingDays: undefined,
  equipment: [],
  limitations: '',
  email: '',
  acceptedTerms: undefined,
};

export function useQuestionnaire() {
  const [state, setState] = useState<QuestionnaireState>({
    data: initialData,
    currentStep: 0,
    direction: 'forward',
    isSubmitting: false,
    submitError: null,
  });

  const updateData = useCallback((updates: PartialQuestionnaire) => {
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, ...updates },
      submitError: null,
    }));
  }, []);

  const goToNextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, TOTAL_STEPS - 1),
      direction: 'forward',
    }));
  }, []);

  const goToPrevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
      direction: 'backward',
    }));
  }, []);

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setState((prev) => ({ ...prev, isSubmitting }));
  }, []);

  const setSubmitError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, submitError: error, isSubmitting: false }));
  }, []);

  const canProceed = useCallback((step: number): boolean => {
    const { data } = state;
    switch (step) {
      case 0:
        return !!data.acrobaticsType;
      case 1:
        return !!data.role;
      case 2:
        return !!data.level;
      case 3:
        return (data.goals?.length ?? 0) > 0;
      case 4:
        return !!data.trainingDays;
      case 5:
        return true; // Equipment is optional
      case 6:
        return true; // Limitations is optional
      case 7:
        return !!data.email && data.email.includes('@') && data.acceptedTerms === true;
      default:
        return false;
    }
  }, [state]);

  const isComplete = useCallback((): boolean => {
    const { data } = state;
    return !!(
      data.acrobaticsType &&
      data.role &&
      data.level &&
      (data.goals?.length ?? 0) > 0 &&
      data.trainingDays &&
      data.email &&
      data.email.includes('@') &&
      data.acceptedTerms === true
    );
  }, [state]);

  return {
    ...state,
    totalSteps: TOTAL_STEPS,
    updateData,
    goToNextStep,
    goToPrevStep,
    setSubmitting,
    setSubmitError,
    canProceed,
    isComplete,
  };
}
