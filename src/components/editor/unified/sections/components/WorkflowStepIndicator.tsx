
import React from 'react';
import { Sparkles, Grid, FileImage, Layers } from 'lucide-react';
import { WorkflowStep } from '../../types';

interface WorkflowStepIndicatorProps {
  currentStep: WorkflowStep;
  workflow: string | null;
}

export const WorkflowStepIndicator: React.FC<WorkflowStepIndicatorProps> = ({ 
  currentStep, 
  workflow 
}) => {
  const getWorkflowSteps = () => {
    switch (workflow) {
      case 'batch-processing':
        return [
          { id: 'batch-processing', label: 'Batch Upload', description: 'Upload multiple images', icon: Grid },
          { id: 'effects', label: 'Effects', description: 'Apply batch effects', icon: Sparkles }
        ];
      case 'psd-professional':
        return [
          { id: 'upload', label: 'PSD Upload', description: 'Upload PSD file', icon: Layers },
          { id: 'psd-manager', label: 'Layer Manager', description: 'Extract layers', icon: Grid },
          { id: 'effects', label: 'Effects', description: 'Apply effects', icon: Sparkles }
        ];
      default:
        // Simplified 2-step workflow for standard images
        return [
          { id: 'upload', label: 'Upload & Select', description: 'Image + Template', icon: FileImage },
          { id: 'effects', label: 'Customize', description: 'Effects & Publish', icon: Sparkles }
        ];
    }
  };

  const steps = getWorkflowSteps();
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="flex items-center justify-center gap-3 py-6">
      {/* Workflow Badge */}
      {workflow && (
        <div className="bg-gradient-to-r from-crd-green/20 to-crd-blue/20 border border-crd-green/40 rounded-full px-4 py-2 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-crd-green" />
            <span className="text-crd-green font-medium text-sm">
              {workflow.replace('-', ' ').toUpperCase()} WORKFLOW
            </span>
          </div>
        </div>
      )}
      
      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive 
                ? 'bg-gradient-to-r from-crd-green/30 to-crd-blue/30 border-2 border-crd-green/50 shadow-lg scale-105' 
                : isCompleted 
                ? 'bg-crd-green/15 border border-crd-green/30' 
                : 'bg-crd-mediumGray/10 border border-crd-mediumGray/20'
            }`}>
              <div className={`w-6 h-6 flex items-center justify-center ${
                isActive ? 'text-crd-green' : isCompleted ? 'text-crd-green' : 'text-crd-mediumGray'
              }`}>
                {isCompleted ? '✓' : <Icon className="w-4 h-4" />}
              </div>
              <div>
                <div className={`font-semibold text-s ${
                  isActive ? 'text-crd-green' : isCompleted ? 'text-crd-green' : 'text-crd-mediumGray'
                }`}>
                  {step.label}
                </div>
                <div className="text-xs text-crd-lightGray">
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
