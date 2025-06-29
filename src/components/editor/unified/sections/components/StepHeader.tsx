
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Upload, Route, FileTemplate, Layers } from 'lucide-react';

type WorkflowStep = 'upload' | 'path-selection' | 'template-selection' | 'psd-manager';

interface StepHeaderProps {
  currentStep: WorkflowStep;
  mediaDetection?: any;
}

export const StepHeader: React.FC<StepHeaderProps> = ({ currentStep, mediaDetection }) => {
  const getStepIcon = () => {
    switch (currentStep) {
      case 'upload':
        return <Upload className="w-6 h-6" />;
      case 'path-selection':
        return <Route className="w-6 h-6" />;
      case 'template-selection':
        return <FileTemplate className="w-6 h-6" />;
      case 'psd-manager':
        return <Layers className="w-6 h-6" />;
      default:
        return <Upload className="w-6 h-6" />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'upload':
        return 'Upload Your Media';
      case 'path-selection':
        return 'Choose Your Workflow';
      case 'template-selection':
        return 'Select Template';
      case 'psd-manager':
        return 'PSD Professional Studio';
      default:
        return 'Upload Your Media';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'upload':
        return 'Start by uploading your photo or PSD file';
      case 'path-selection':
        return 'Select the best creation path for your content';
      case 'template-selection':
        return 'Pick a template that matches your vision';
      case 'psd-manager':
        return 'Professional layer management and frame generation';
      default:
        return 'Start by uploading your photo or PSD file';
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
