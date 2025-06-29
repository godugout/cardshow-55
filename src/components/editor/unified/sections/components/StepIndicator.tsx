
import React from 'react';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

type WorkflowStep = 'upload' | 'path-selection' | 'template-selection' | 'psd-manager';

interface StepIndicatorProps {
  currentStep: WorkflowStep;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: 'upload', label: 'Upload', description: 'Choose your media' },
    { id: 'path-selection', label: 'Workflow', description: 'Select creation path' },
    { id: 'template-selection', label: 'Template', description: 'Pick design' },
    { id: 'psd-manager', label: 'PSD Studio', description: 'Professional editing' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;
        const isCompleted = index < currentStepIndex;
        const isVisible = index <= currentStepIndex || (currentStep === 'psd-manager' && step.id === 'psd-manager');

        if (!isVisible) return null;

        return (
          <React.Fragment key={step.id}>
            <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-gradient-to-r from-crd-green/20 to-crd-blue/20 border border-crd-green/40 shadow-lg' 
                : isCompleted 
                ? 'bg-crd-green/10 border border-crd-green/20' 
                : 'bg-crd-mediumGray/10 border border-crd-mediumGray/20'
            }`}>
              {isCompleted ? (
                <CheckCircle className="w-5 h-5 text-crd-green" />
              ) : (
                <Circle className={`w-5 h-5 ${isActive ? 'text-crd-green' : 'text-crd-mediumGray'}`} />
              )}
              <div>
                <div className={`font-semibold ${
                  isActive ? 'text-crd-green' : isCompleted ? 'text-crd-green' : 'text-crd-mediumGray'
                }`}>
                  {step.label}
                </div>
                <div className="text-xs text-crd-lightGray">
                  {step.description}
                </div>
              </div>
            </div>
            
            {index < steps.length - 1 && isVisible && (
              <ArrowRight className="w-4 h-4 text-crd-mediumGray" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
