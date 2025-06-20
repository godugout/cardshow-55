
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProfessionalWorkflowProps {
  currentStep: string;
  onStepComplete: (data: any) => void;
  onCropRequest: (imageData: string) => void;
  initialData: any;
}

export const ProfessionalWorkflow = ({ onStepComplete }: ProfessionalWorkflowProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Card className="bg-crd-darkGray border-crd-mediumGray/30 p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Professional Workflow</h2>
        <p className="text-crd-lightGray mb-6">
          Advanced professional tools and workflow coming soon - includes layers, effects, and collaboration features.
        </p>
        <Button
          onClick={() => onStepComplete({})}
          className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
        >
          Continue
        </Button>
      </Card>
    </div>
  );
};
