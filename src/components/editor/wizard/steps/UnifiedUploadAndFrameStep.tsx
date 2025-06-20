
import React from 'react';
import { CleanUnifiedStep } from './CleanUnifiedStep';
import type { DesignTemplate } from '@/hooks/useCardEditor';
import type { WizardMode } from '../UnifiedCardWizard';

interface UnifiedUploadAndFrameStepProps {
  mode: WizardMode;
  selectedPhoto: string;
  onPhotoSelect: (photo: string) => void;
  onAnalysisComplete?: (analysis: any) => void;
  templates: DesignTemplate[];
  selectedTemplate: DesignTemplate | null;
  onTemplateSelect: (template: DesignTemplate) => void;
}

export const UnifiedUploadAndFrameStep = ({ 
  mode,
  selectedPhoto, 
  onPhotoSelect, 
  onAnalysisComplete,
  templates,
  selectedTemplate,
  onTemplateSelect
}: UnifiedUploadAndFrameStepProps) => {
  console.log('UnifiedUploadAndFrameStep - selectedPhoto:', selectedPhoto);
  console.log('UnifiedUploadAndFrameStep - onPhotoSelect available:', !!onPhotoSelect);
  console.log('UnifiedUploadAndFrameStep - mode:', mode);

  return (
    <CleanUnifiedStep
      mode={mode}
      selectedPhoto={selectedPhoto}
      onPhotoSelect={onPhotoSelect}
      onAnalysisComplete={onAnalysisComplete}
      templates={templates}
      selectedTemplate={selectedTemplate}
      onTemplateSelect={onTemplateSelect}
    />
  );
};
