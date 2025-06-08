
import React from 'react';
import type { SpaceTemplate } from '../../types/spaces';

interface SpaceTemplateSelectorProps {
  templates: SpaceTemplate[];
  selectedTemplate: SpaceTemplate | null;
  onTemplateSelect: (template: SpaceTemplate | null) => void;
}

export const SpaceTemplateSelector: React.FC<SpaceTemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onTemplateSelect(template)}
          className={`group relative p-4 rounded-lg border transition-all ${
            selectedTemplate?.id === template.id
              ? 'border-crd-green bg-crd-green/10'
              : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
          }`}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">{template.emoji}</div>
            <div className="text-sm font-medium text-white mb-1">{template.name}</div>
            <div className="text-xs text-gray-400 line-clamp-2">{template.description}</div>
            <div className="text-xs text-gray-500 mt-2">
              {template.category} • {template.maxCards} cards
            </div>
          </div>
          
          {selectedTemplate?.id === template.id && (
            <div className="absolute top-2 right-2">
              <div className="w-3 h-3 bg-crd-green rounded-full" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
