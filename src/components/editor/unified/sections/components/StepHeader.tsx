
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface StepHeaderProps {
  currentStep: 'upload' | 'path-selection' | 'template-selection';
  mediaDetection: any;
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  currentStep,
  mediaDetection
}) => {
  const getStepTitle = () => {
    switch (currentStep) {
      case 'upload':
        return 'Upload & Analyze Your Media';
      case 'path-selection':
        return 'Choose Your Workflow';
      case 'template-selection':
        return 'Select Template';
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'upload':
        return 'Upload your file and let our AI detect the best workflow';
      case 'path-selection':
        return 'Select the approach that matches your goals';
      case 'template-selection':
        return 'Choose a frame template for your card';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-xl font-semibold text-crd-white">
          {getStepTitle()}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-crd-lightGray">
            {getStepDescription()}
          </p>
          
          {mediaDetection && (
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-crd-green" />
              <span className="text-crd-green font-medium">{mediaDetection.format}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
