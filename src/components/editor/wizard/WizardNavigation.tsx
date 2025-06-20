
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import { CompactCardInfoBar } from './components/CompactCardInfoBar';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  isLastStep: boolean;
  isSaving: boolean;
  selectedTemplate?: DesignTemplate | null;
  imageFormat?: 'square' | 'circle' | 'fullBleed';
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
  onComplete: () => void;
  canSkipToEnd?: boolean;
}

export const WizardNavigation = ({
  currentStep,
  totalSteps,
  isLastStep,
  isSaving,
  selectedTemplate,
  imageFormat = 'fullBleed',
  onCancel,
  onBack,
  onNext,
  onComplete,
  canSkipToEnd = false
}: WizardNavigationProps) => {
  return (
    <div className="flex items-center justify-between pt-8 border-t border-editor-border mt-8">
      {/* Left side - Back button */}
      <div>
        {currentStep > 1 ? (
          <Button
            variant="outline"
            onClick={onBack}
            className="border-editor-border text-editor-text-secondary hover:text-editor-text-primary hover:bg-editor-border"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-editor-border text-editor-text-secondary hover:text-editor-text-primary hover:bg-editor-border"
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Center - Compact card info for step 1 */}
      {currentStep === 1 && (
        <CompactCardInfoBar 
          selectedTemplate={selectedTemplate}
          imageFormat={imageFormat}
        />
      )}

      {/* Right side - Next/Complete buttons */}
      <div className="flex items-center gap-3">
        {canSkipToEnd && currentStep < totalSteps && (
          <Button
            variant="outline"
            onClick={onComplete}
            className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
          >
            <Zap className="w-4 h-4 mr-2" />
            Quick Complete
          </Button>
        )}
        
        {isLastStep ? (
          <Button
            onClick={onComplete}
            disabled={isSaving}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-medium"
          >
            {isSaving ? 'Creating...' : 'Create Card'}
          </Button>
        ) : (
          <Button
            onClick={onNext}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-medium"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
