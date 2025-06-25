
import React from 'react';
import { Check } from 'lucide-react';
import type { CreationStep } from '../types';

interface ProgressIndicatorProps {
  steps: CreationStep[];
  currentStep: CreationStep;
  progress: number;
}

const stepLabels: Record<CreationStep, string> = {
  intent: 'Mode',
  upload: 'Upload',
  details: 'Details',
  design: 'Design',
  publish: 'Publish',
  complete: 'Complete'
};

export const ProgressIndicator = ({ steps, currentStep, progress }: ProgressIndicatorProps) => {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Progress Bar */}
      <div className="w-full bg-crd-mediumGray/30 rounded-full h-2 mb-6">
        <div 
          className="bg-crd-green h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-2 ${
                isCompleted 
                  ? 'bg-crd-green text-black' 
                  : isCurrent 
                    ? 'bg-crd-green text-black'
                    : 'bg-crd-mediumGray text-crd-lightGray'
              }`}>
                {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              <span className={`text-sm ${
                isCurrent ? 'text-crd-white font-medium' : 'text-crd-lightGray'
              }`}>
                {stepLabels[step]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
