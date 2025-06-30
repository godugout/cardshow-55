
import React from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { WorkflowStep } from '../../types';

interface WorkflowNavigationProps {
  currentStep: WorkflowStep;
  canProceed: boolean;
  stepText: string;
  workflow: string | null;
  onBack: () => void;
  onNext: () => void;
}

export const WorkflowNavigation: React.FC<WorkflowNavigationProps> = ({
  currentStep,
  canProceed,
  stepText,
  workflow,
  onBack,
  onNext
}) => {
  const getStepInfo = () => {
    const workflow = new URLSearchParams(window.location.search).get('workflow');
    const baseStepMap = {
      'upload': { number: 1, total: 4 },
      'path-selection': { number: 2, total: 4 },
      'template-selection': { number: 3, total: 4 },
      'psd-manager': { number: 3, total: 4 },
      'batch-processing': { number: 1, total: 3 }
    };
    
    if (workflow === 'batch-processing') {
      return { number: 1, total: 3 };
    }
    
    return baseStepMap[currentStep] || { number: 1, total: 4 };
  };

  const stepInfo = getStepInfo();

  return (
    <div className="flex justify-between items-center py-6 border-y border-crd-green/20 bg-gradient-to-r from-transparent via-crd-green/5 to-transparent">
      <div className="text-lg text-crd-lightGray">
        <span className="text-crd-green font-semibold">Step {stepInfo.number} of {stepInfo.total}</span> - {stepText}
      </div>
      
      <div className="flex gap-4">
        {currentStep !== 'upload' && currentStep !== 'psd-manager' && currentStep !== 'batch-processing' && (
          <CRDButton 
            onClick={onBack}
            variant="outline"
            className="min-w-[100px] border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white hover:border-crd-green/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </CRDButton>
        )}
        
        <CRDButton 
          onClick={onNext} 
          disabled={!canProceed}
          className={`min-w-[140px] ${
            canProceed 
              ? 'bg-gradient-to-r from-crd-green to-crd-blue hover:from-crd-green/90 hover:to-crd-blue/90 text-black font-bold shadow-xl' 
              : 'bg-crd-mediumGray/20 text-crd-lightGray cursor-not-allowed'
          }`}
        >
          {workflow === 'batch-processing' ? 'Continue to Batch Effects' : 'Continue to Effects'}
          <ArrowRight className="w-5 h-5 ml-2" />
        </CRDButton>
      </div>
    </div>
  );
};
