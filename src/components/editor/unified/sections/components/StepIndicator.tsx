
import React from 'react';

interface StepIndicatorProps {
  currentStep: 'upload' | 'path-selection' | 'template-selection';
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep
}) => {
  const steps = ['upload', 'path-selection', 'template-selection'];

  return (
    <div className="flex items-center gap-4">
      {steps.map((step, index) => {
        const isActive = currentStep === step;
        const isCompleted = steps.indexOf(currentStep) > index;
        
        return (
          <div key={step} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              isCompleted ? 'bg-crd-green text-black' :
              isActive ? 'bg-crd-green/20 text-crd-green border-2 border-crd-green' :
              'bg-crd-mediumGray/20 text-crd-lightGray'
            }`}>
              {isCompleted ? '✓' : index + 1}
            </div>
            {index < 2 && (
              <div className={`w-12 h-0.5 ${
                isCompleted ? 'bg-crd-green' : 'bg-crd-mediumGray/30'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};
