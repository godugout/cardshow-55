
import React from 'react';
import { SpaceTemplateSelector } from '../../../spaces/SpaceTemplateSelector';
import type { SpaceTemplate } from '../../../../types/spaces';

interface SpaceTemplateSectionProps {
  templates: SpaceTemplate[];
  selectedTemplate: SpaceTemplate | null;
  onTemplateSelect: (template: SpaceTemplate | null) => void;
}

export const SpaceTemplateSection: React.FC<SpaceTemplateSectionProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect
}) => {
  return (
    <div>
      <h4 className="text-white font-medium text-sm mb-3">Environment Templates</h4>
      <SpaceTemplateSelector
        templates={templates}
        selectedTemplate={selectedTemplate}
        onTemplateSelect={onTemplateSelect}
      />
    </div>
  );
};
