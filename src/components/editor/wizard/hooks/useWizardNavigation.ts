
import { useCallback } from 'react';
import { useWizardContext } from '../WizardContext';

export const useWizardNavigation = () => {
  const { state, dispatch } = useWizardContext();

  const getCurrentStep = useCallback(() => {
    return state.steps.find(step => step.id === state.currentStepId);
  }, [state.steps, state.currentStepId]);

  const getCurrentStepIndex = useCallback(() => {
    return state.steps.findIndex(step => step.id === state.currentStepId);
  }, [state.steps, state.currentStepId]);

  const canNavigateToStep = useCallback((stepId: string) => {
    const targetStep = state.steps.find(step => step.id === stepId);
    const currentIndex = getCurrentStepIndex();
    const targetIndex = state.steps.findIndex(step => step.id === stepId);
    
    if (!targetStep) return false;
    
    // Can always navigate backward to completed steps
    if (targetIndex < currentIndex && targetStep.completed) {
      return true;
    }
    
    // Can navigate forward only to the next step if current step is valid
    if (targetIndex === currentIndex + 1) {
      const currentStep = getCurrentStep();
      return currentStep?.valid || false;
    }
    
    // Can navigate to current step
    return targetIndex === currentIndex;
  }, [state.steps, getCurrentStepIndex, getCurrentStep]);

  const navigateToStep = useCallback((stepId: string) => {
    if (canNavigateToStep(stepId)) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: stepId });
      return true;
    }
    return false;
  }, [canNavigateToStep, dispatch]);

  const nextStep = useCallback(() => {
    const currentIndex = getCurrentStepIndex();
    const nextStepIndex = currentIndex + 1;
    
    if (nextStepIndex < state.steps.length) {
      const nextStep = state.steps[nextStepIndex];
      return navigateToStep(nextStep.id);
    }
    return false;
  }, [getCurrentStepIndex, state.steps, navigateToStep]);

  const previousStep = useCallback(() => {
    const currentIndex = getCurrentStepIndex();
    const prevStepIndex = currentIndex - 1;
    
    if (prevStepIndex >= 0) {
      const prevStep = state.steps[prevStepIndex];
      return navigateToStep(prevStep.id);
    }
    return false;
  }, [getCurrentStepIndex, state.steps, navigateToStep]);

  const validateCurrentStep = useCallback(() => {
    const currentStep = getCurrentStep();
    if (!currentStep) return false;

    let isValid = false;

    switch (currentStep.id) {
      case 'template':
        isValid = !!state.cardData.template_id;
        break;
      case 'upload':
        isValid = !!state.cardData.image_url;
        break;
      case 'details':
        isValid = !!(state.cardData.title && state.cardData.title.trim());
        break;
      case 'effects':
        isValid = true; // Effects are optional
        break;
      case 'publish':
        isValid = !!(state.cardData.title && state.cardData.image_url && state.cardData.template_id);
        break;
      default:
        isValid = false;
    }

    dispatch({ 
      type: 'SET_STEP_VALIDITY', 
      payload: { stepId: currentStep.id, valid: isValid } 
    });

    return isValid;
  }, [getCurrentStep, state.cardData, dispatch]);

  const completeCurrentStep = useCallback(() => {
    const currentStep = getCurrentStep();
    if (currentStep && validateCurrentStep()) {
      dispatch({ type: 'MARK_STEP_COMPLETED', payload: currentStep.id });
      return true;
    }
    return false;
  }, [getCurrentStep, validateCurrentStep, dispatch]);

  const canGoNext = useCallback(() => {
    return getCurrentStepIndex() < state.steps.length - 1 && validateCurrentStep();
  }, [getCurrentStepIndex, state.steps.length, validateCurrentStep]);

  const canGoBack = useCallback(() => {
    return getCurrentStepIndex() > 0;
  }, [getCurrentStepIndex]);

  const isLastStep = useCallback(() => {
    return getCurrentStepIndex() === state.steps.length - 1;
  }, [getCurrentStepIndex, state.steps.length]);

  return {
    currentStep: getCurrentStep(),
    currentStepIndex: getCurrentStepIndex(),
    steps: state.steps,
    navigateToStep,
    nextStep,
    previousStep,
    validateCurrentStep,
    completeCurrentStep,
    canGoNext,
    canGoBack,
    isLastStep,
    canNavigateToStep
  };
};
