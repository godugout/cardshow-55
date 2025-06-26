
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
  console.log('🚀 UniversalCardCreator: Rendering with props:', { initialMode, onComplete, onCancel });
  
  const navigate = useNavigate();
  
  try {
    console.log('🎯 UniversalCardCreator: Initializing useUniversalCreator hook');
    
    const {
      state,
      cardEditor,
      currentConfig,
      actions
    } = useUniversalCreator({
      initialMode,
      onComplete,
      onCancel: onCancel || (() => {
        console.log('🔙 UniversalCardCreator: Navigating to gallery (default cancel)');
        navigate('/gallery');
      })
    });

    console.log('✅ UniversalCardCreator: Hook initialized successfully', {
      currentStep: state.currentStep,
      mode: state.mode,
      hasConfig: !!currentConfig
    });

    const canProceed = actions.validateStep();
    const showNavigation = state.currentStep !== 'intent' && state.currentStep !== 'complete';
    const showModeSwitch = state.currentStep !== 'intent' && state.currentStep !== 'complete';

    console.log('🎮 UniversalCardCreator: Render state', {
      canProceed,
      showNavigation,
      showModeSwitch,
      currentStep: state.currentStep
    });

    // Move console.log outside of JSX
    console.log('📄 UniversalCardCreator: Rendering StepContent');

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
                    onClick={() => {
                      console.log('🔄 UniversalCardCreator: Switching mode');
                      actions.updateState({ currentStep: 'intent' });
                    }}
                    className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Switch Mode
                  </CRDButton>
                )}
              </div>

              <CRDButton
                variant="outline"
                onClick={() => {
                  console.log('❌ UniversalCardCreator: Cancel clicked');
                  navigate('/gallery');
                }}
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
              onModeSelect={actions.setMode}
              onPhotoSelect={(photo) => {
                console.log('📸 UniversalCardCreator: Photo selected', photo);
                cardEditor.updateCardField('image_url', photo);
              }}
              onFieldUpdate={cardEditor.updateCardField}
              onBulkUpload={() => {
                console.log('📁 UniversalCardCreator: Bulk upload requested');
                navigate('/cards/bulk-upload');
              }}
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
                  onClick={() => {
                    console.log('⬅️ UniversalCardCreator: Previous step');
                    actions.previousStep();
                  }}
                  disabled={!state.canGoBack}
                  className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </CRDButton>

                <div className="text-crd-lightGray text-sm">
                  Step {currentConfig?.steps.indexOf(state.currentStep)! + 1} of {currentConfig?.steps.length}
                </div>

                {state.currentStep === 'publish' ? (
                  <CRDButton
                    variant="primary"
                    onClick={() => {
                      console.log('🚀 UniversalCardCreator: Complete creation');
                      actions.completeCreation();
                    }}
                    disabled={!canProceed || state.isCreating}
                    className="bg-crd-green hover:bg-crd-green/80 text-black"
                  >
                    {state.isCreating ? 'Creating...' : 'Create Card'}
                  </CRDButton>
                ) : (
                  <CRDButton
                    variant="primary"
                    onClick={() => {
                      console.log('➡️ UniversalCardCreator: Next step');
                      actions.nextStep();
                    }}
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
  } catch (error) {
    console.error('💥 UniversalCardCreator: Critical error during render:', error);
    
    // Fallback UI
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Creation Error</div>
          <div className="text-crd-lightGray mb-4">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </div>
          <CRDButton
            variant="primary"
            onClick={() => navigate('/gallery')}
          >
            Go Back to Gallery
          </CRDButton>
        </div>
      </div>
    );
  }
};
