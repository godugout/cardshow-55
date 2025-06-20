
import React from 'react';
import { CardPreviewSection } from '../components/CardPreviewSection';
import { CleanFrameSelector } from '../components/CleanFrameSelector';
import { CardDetailsBlock } from '../components/CardDetailsBlock';
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

  return (
    <div className="grid grid-cols-3 gap-8 h-full">
      {/* Left Side - Large Preview (2/3 width) */}
      <div className="col-span-2 space-y-6">
        <CardPreviewSection
          selectedPhoto={selectedPhoto}
          selectedTemplate={selectedTemplate}
          onPhotoSelect={onPhotoSelect}
        />
      </div>

      {/* Right Sidebar - Frame Selection & Card Details (1/3 width) */}
      <div className="space-y-6">
        <CleanFrameSelector
          mode={mode}
          selectedPhoto={selectedPhoto}
          selectedTemplate={selectedTemplate}
          onTemplateSelect={onTemplateSelect}
          imageFormat={imageFormat}
          onImageFormatChange={setImageFormat}
        />

        <CardDetailsBlock
          selectedTemplate={selectedTemplate}
          imageFormat={imageFormat}
        />
      </div>
    </div>
  );
};
