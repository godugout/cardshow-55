
import React from 'react';
import { usePhotoUpload } from '../hooks/usePhotoUpload';
import { WizardModeHeader } from '../components/WizardModeHeader';
import { CardPreviewSection } from '../components/CardPreviewSection';
import { FrameSelectionSidebar } from '../components/FrameSelectionSidebar';
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
  const { isAnalyzing } = usePhotoUpload(
    onPhotoSelect, 
    onAnalysisComplete
  );

  const handlePhotoRemove = () => {
    onPhotoSelect('');
  };

  return (
    <div className="grid grid-cols-3 gap-8 h-full">
      {/* Left Side - Large Preview (2/3 width) */}
      <div className="col-span-2 space-y-6">
        <WizardModeHeader mode={mode} isAnalyzing={isAnalyzing} />
        <CardPreviewSection
          selectedPhoto={selectedPhoto}
          selectedTemplate={selectedTemplate}
        />
      </div>

      {/* Right Sidebar - Upload & Frame Selection (1/3 width) */}
      <div>
        <FrameSelectionSidebar
          mode={mode}
          selectedPhoto={selectedPhoto}
          onPhotoSelect={onPhotoSelect}
          onPhotoRemove={handlePhotoRemove}
          isAnalyzing={isAnalyzing}
          templates={templates}
          selectedTemplate={selectedTemplate}
          onTemplateSelect={onTemplateSelect}
        />
      </div>
    </div>
  );
};
