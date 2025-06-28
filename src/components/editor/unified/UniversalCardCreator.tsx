
import React from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system/Button';
import { useUniversalCreator } from './hooks/useUniversalCreator';
import { ProgressIndicator } from './components/ProgressIndicator';
import { StepContent } from './components/StepContent';
import { CreationErrorBoundary } from './components/CreationErrorBoundary';
import type { CreationMode } from './types';
import type { CardData } from '@/hooks/useCardEditor';

interface UniversalCardCreatorProps {
  initialMode?: CreationMode;
  onComplete?: (cardData: CardData) => void;
  onCancel?: () => void;
}

export const UniversalCardCreator = ({
  initialMode = 'quick',
  onComplete,
  onCancel
}: UniversalCardCreatorProps) => {
  console.log('🚀 UniversalCardCreator: Rendering with mode:', initialMode);
  
  const navigate = useNavigate();
  
  const {
    state,
    cardEditor,
    currentConfig,
    actions
  } = useUniversalCreator({
    initialMode,
    onComplete,
    onCancel: onCancel || (() => navigate('/gallery'))
  });

  const canProceed = actions.validateStep();
  const showNavigation = state.currentStep !== 'intent' && state.currentStep !== 'complete';
  const showModeSwitch = state.currentStep !== 'intent' && state.currentStep !== 'complete';

  // Add debug logging for mode selection
  const handleModeSelect = (mode: CreationMode) => {
    console.log('🎯 UniversalCardCreator: Mode selected:', mode);
    actions.setMode(mode);
  };

  const handleBulkUpload = () => {
    console.log('📦 UniversalCardCreator: Bulk upload selected');
    navigate('/cards/bulk-upload');
  };

  // Remove the problematic loading state check - just render the component
  console.log('🎯 UniversalCardCreator: Current state:', {
    mode: state.mode,
    step: state.currentStep,
    hasConfig: !!currentConfig,
    isCreating: state.isCreating
  });

  return (
    <CreationErrorBoundary onReset={actions.startOver}>
      <div className="min-h-screen bg-crd-darkest">
        {/* Header */}
        <div className="bg-crd-darker border-b border-crd-mediumGray/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-crd-white">
                {currentConfig?.title || 'Create Card'}
              </h1>
              {showModeSwitch && (
                <CRDButton
                  variant="outline"
                  size="sm"
                  onClick={() => actions.updateState({ currentStep: 'intent' })}
                  className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Switch Mode
                </CRDButton>
              )}
            </div>

            <CRDButton
              variant="outline"
              onClick={() => navigate('/gallery')}
              className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
            >
              Cancel
            </CRDButton>
          </div>
        </div>

        {/* Progress Indicator */}
        {currentConfig && state.currentStep !== 'intent' && (
          <div className="bg-crd-darker border-b border-crd-mediumGray/20 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ProgressIndicator
                steps={currentConfig.steps}
                currentStep={state.currentStep}
                progress={state.progress}
              />
            </div>
          </div>
        )}

        {/* Error Display */}
        {state.creationError && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-200 px-4 py-3 mx-4 mt-4 rounded">
            <p className="text-sm">
              <strong>Error:</strong> {state.creationError}
            </p>
          </div>
        )}

        {/* Step-specific Error Display */}
        {Object.keys(state.errors).length > 0 && (
          <div className="bg-amber-900/20 border border-amber-500/30 text-amber-200 px-4 py-3 mx-4 mt-4 rounded">
            {Object.entries(state.errors).map(([step, error]) => (
              <p key={step} className="text-sm">
                <strong>Note:</strong> {error}
              </p>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <StepContent
            step={state.currentStep}
            mode={state.mode}
            cardData={cardEditor.cardData}
            onModeSelect={handleModeSelect}
            onPhotoSelect={(photo) => cardEditor.updateCardField('image_url', photo)}
            onFieldUpdate={cardEditor.updateCardField}
            onBulkUpload={handleBulkUpload}
            onGoToGallery={actions.goToGallery}
            onStartOver={actions.startOver}
          />
        </div>

        {/* Navigation */}
        {showNavigation && (
          <div className="fixed bottom-0 left-0 right-0 bg-crd-darker border-t border-crd-mediumGray/20 p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <CRDButton
                variant="outline"
                onClick={actions.previousStep}
                disabled={!state.canGoBack}
                className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </CRDButton>

              <div className="text-crd-lightGray text-sm">
                Step {(currentConfig?.steps.indexOf(state.currentStep) ?? 0) + 1} of {currentConfig?.steps.length}
              </div>

              {state.currentStep === 'publish' ? (
                <CRDButton
                  variant="primary"
                  onClick={actions.completeCreation}
                  disabled={!canProceed || state.isCreating}
                  className="bg-crd-green hover:bg-crd-green/80 text-black"
                >
                  {state.isCreating ? 'Creating...' : 'Create Card'}
                </CRDButton>
              ) : (
                <CRDButton
                  variant="primary"
                  onClick={actions.nextStep}
                  disabled={!canProceed}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </CRDButton>
              )}
            </div>
          </div>
        )}
      </div>
    </CreationErrorBoundary>
  );
};
