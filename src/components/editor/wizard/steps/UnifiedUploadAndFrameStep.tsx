
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

export const UnifiedUploadAndFrameStep = (props: UnifiedUploadAndFrameStepProps) => {
  return <CleanUnifiedStep {...props} />;
};
