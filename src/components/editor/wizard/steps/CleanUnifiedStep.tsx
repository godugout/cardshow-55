
import React from 'react';
import { usePhotoUpload } from '../hooks/usePhotoUpload';
import { WizardModeHeader } from '../components/WizardModeHeader';
import { CardPreviewSection } from '../components/CardPreviewSection';
import { CleanPhotoSection } from '../components/CleanPhotoSection';
import { CleanFrameSelector } from '../components/CleanFrameSelector';
import type { DesignTemplate } from '@/hooks/useCardEditor';
import type { WizardMode } from '../UnifiedCardWizard';

interface CleanUnifiedStepProps {
  mode: WizardMode;
  selectedPhoto: string;
  onPhotoSelect: (photo: string) => void;
  onAnalysisComplete?: (analysis: any) => void;
  templates: DesignTemplate[];
  selectedTemplate: DesignTemplate | null;
  onTemplateSelect: (template: DesignTemplate) => void;
}

export const CleanUnifiedStep = ({ 
  mode,
  selectedPhoto, 
  onPhotoSelect, 
  onAnalysisComplete,
  templates,
  selectedTemplate,
  onTemplateSelect
}: CleanUnifiedStepProps) => {
  const [imageFormat, setImageFormat] = React.useState<'square' | 'circle' | 'fullBleed'>('fullBleed');
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

      {/* Right Sidebar - Clean Upload & Frame Selection (1/3 width) */}
      <div className="space-y-6">
        <CleanPhotoSection
          selectedPhoto={selectedPhoto}
          selectedTemplate={selectedTemplate}
          onPhotoSelect={onPhotoSelect}
          onPhotoRemove={handlePhotoRemove}
          isAnalyzing={isAnalyzing}
        />

        <CleanFrameSelector
          mode={mode}
          selectedPhoto={selectedPhoto}
          selectedTemplate={selectedTemplate}
          onTemplateSelect={onTemplateSelect}
          imageFormat={imageFormat}
          onImageFormatChange={setImageFormat}
        />
      </div>
    </div>
  );
};
