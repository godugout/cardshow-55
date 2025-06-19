
import React from 'react';
import { Check } from 'lucide-react';

interface WizardStep {
  number: number;
  title: string;
  description: string;
}

interface WizardStepIndicatorProps {
  steps: WizardStep[];
  currentStep: number;
}

export const WizardStepIndicator = ({ steps, currentStep }: WizardStepIndicatorProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                currentStep >= step.number ? 'bg-crd-green text-black' : 
                currentStep === step.number ? 'bg-crd-blue text-white' : 'bg-editor-border text-gray-400'
              }`}>
                {currentStep > step.number ? <Check size={14} /> : step.number}
              </div>
              <div className="ml-3 hidden md:block">
                <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-white' : 'text-gray-400'}`}>
                  {step.title}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-px mx-4 ${currentStep > step.number ? 'bg-crd-green' : 'bg-editor-border'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
