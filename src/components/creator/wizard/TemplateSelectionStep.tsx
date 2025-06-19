
import React from 'react';
import { ModularTemplateSelectionStep } from '@/components/editor/wizard/steps/ModularTemplateSelectionStep';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface TemplateSelectionStepProps {
  templates: DesignTemplate[];
  selectedTemplate: DesignTemplate | null;
  onTemplateSelect: (template: DesignTemplate) => void;
  selectedPhoto?: string;
}

export const TemplateSelectionStep = ({ 
  selectedTemplate, 
  onTemplateSelect,
  selectedPhoto 
}: TemplateSelectionStepProps) => {
  return (
    <ModularTemplateSelectionStep
      selectedTemplate={selectedTemplate}
      onTemplateSelect={onTemplateSelect}
      selectedPhoto={selectedPhoto}
    />
  );
};
