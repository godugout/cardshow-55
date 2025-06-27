
import React from 'react';
import { ArrowLeft, ArrowRight, Save, Check } from 'lucide-react';
import { useWizardContext } from './WizardContext';
import { useWizardNavigation } from './hooks/useWizardNavigation';

interface WizardActionBarProps {
  onComplete?: (cardData: any) => void;
}

export const WizardActionBar: React.FC<WizardActionBarProps> = ({ onComplete }) => {
  const { state, dispatch } = useWizardContext();
  const { 
    nextStep, 
    previousStep, 
    canGoNext, 
    canGoBack, 
    isLastStep,
    validateCurrentStep,
    completeCurrentStep
  } = useWizardNavigation();

  const handleNext = () => {
    if (validateCurrentStep()) {
      completeCurrentStep();
      nextStep();
    }
  };

  const handleComplete = () => {
    if (validateCurrentStep() && onComplete) {
      completeCurrentStep();
      onComplete(state.cardData);
    }
  };

  const handleSave = () => {
    localStorage.setItem('cardshow-wizard-state', JSON.stringify(state));
    dispatch({ type: 'MARK_SAVED' });
  };

  return (
    <div className="bg-crd-darker border-t border-crd-mediumGray/20 p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Left Side - Back Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={previousStep}
            disabled={!canGoBack}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              canGoBack
                ? 'bg-crd-mediumGray text-white hover:bg-crd-mediumGray/80'
                : 'bg-crd-mediumGray/30 text-crd-lightGray/50 cursor-not-allowed'
            }`}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-3 py-2 text-crd-lightGray hover:text-white transition-colors"
            title="Save Progress"
          >
            <Save size={16} />
            {state.lastSaved && (
              <span className="text-xs">
                Saved {new Date(state.lastSaved).toLocaleTimeString()}
              </span>
            )}
          </button>
        </div>

        {/* Center - Step Info */}
        <div className="hidden md:block text-center">
          <p className="text-crd-lightGray text-sm">
            Step {state.steps.findIndex(s => s.id === state.currentStepId) + 1} of {state.steps.length}
          </p>
          <p className="text-white font-medium">
            {state.steps.find(s => s.id === state.currentStepId)?.title}
          </p>
        </div>

        {/* Right Side - Next/Complete Button */}
        <div className="flex items-center gap-3">
          {state.isLoading && (
            <div className="flex items-center gap-2 text-crd-lightGray">
              <div className="w-4 h-4 border-2 border-crd-green border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Saving...</span>
            </div>
          )}

          {isLastStep ? (
            <button
              onClick={handleComplete}
              disabled={!validateCurrentStep() || state.isLoading}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                validateCurrentStep() && !state.isLoading
                  ? 'bg-crd-green text-black hover:bg-crd-green/90'
                  : 'bg-crd-green/30 text-black/50 cursor-not-allowed'
              }`}
            >
              <Check size={16} />
              Create Card
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canGoNext || state.isLoading}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                canGoNext && !state.isLoading
                  ? 'bg-crd-green text-black hover:bg-crd-green/90'
                  : 'bg-crd-green/30 text-black/50 cursor-not-allowed'
              }`}
            >
              Next
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
