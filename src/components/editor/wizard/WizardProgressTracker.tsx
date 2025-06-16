
import React from 'react';
import { Check } from 'lucide-react';

interface WizardStep {
  number: number;
  title: string;
  description: string;
}

interface WizardProgressTrackerProps {
  currentStep: number;
  steps: WizardStep[];
}

export const WizardProgressTracker = ({ currentStep, steps }: WizardProgressTrackerProps) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold mb-2 ${
              currentStep >= step.number ? 'bg-crd-green text-black' : 'bg-gray-600 text-gray-300'
            }`}>
              {currentStep > step.number ? <Check size={16} /> : step.number}
            </div>
            <div className="text-center">
              <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-white' : 'text-gray-400'}`}>
                {step.title}
              </p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`h-px w-16 mx-4 mt-[-20px] ${currentStep > step.number ? 'bg-crd-green' : 'bg-gray-600'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
