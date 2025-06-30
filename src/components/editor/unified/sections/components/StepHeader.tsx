
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Upload, Layers } from 'lucide-react';
import { WorkflowStep } from '../../types';

interface StepHeaderProps {
  currentStep: WorkflowStep;
  mediaDetection?: any;
}

export const StepHeader: React.FC<StepHeaderProps> = ({ currentStep, mediaDetection }) => {
  const getStepIcon = () => {
    switch (currentStep) {
      case 'upload':
        return <Upload className="w-6 h-6" />;
      case 'psd-manager':
        return <Layers className="w-6 h-6" />;
      case 'batch-processing':
        return <Layers className="w-6 h-6" />;
      default:
        return <Upload className="w-6 h-6" />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'upload':
        return 'Upload & Select Template';
      case 'psd-manager':
        return 'PSD Professional Studio';
      case 'batch-processing':
        return 'Batch Processing Studio';
      default:
        return 'Upload & Select Template';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'upload':
        return 'Upload your image and choose a template to get started';
      case 'psd-manager':
        return 'Professional layer management and frame generation';
      case 'batch-processing':
        return 'Efficient processing of multiple images for batch card creation';
      default:
        return 'Upload your image and choose a template to get started';
    }
  };

  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-3">
        <div className="bg-gradient-to-r from-crd-green to-crd-blue p-3 rounded-xl text-black">
          {getStepIcon()}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-crd-white">{getStepTitle()}</h2>
          <p className="text-crd-lightGray">{getStepDescription()}</p>
        </div>
      </div>
      
      {mediaDetection && (
        <div className="flex justify-center">
          <Badge className="bg-crd-green/20 text-crd-green border-crd-green/30">
            Detected: {mediaDetection.format}
          </Badge>
        </div>
      )}
    </div>
  );
};
