
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SpaceTemplate } from '../../types/spaces';

interface SpaceTemplateSelectorProps {
  templates: SpaceTemplate[];
  selectedTemplate: SpaceTemplate | null;
  onTemplateSelect: (template: SpaceTemplate) => void;
}

export const SpaceTemplateSelector: React.FC<SpaceTemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect
}) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template) => {
          const isSelected = selectedTemplate?.id === template.id;
          
          return (
            <Button
              key={template.id}
              onClick={() => onTemplateSelect(template)}
              variant="ghost"
              className={cn(
                "h-auto p-3 flex flex-col items-center space-y-2 transition-all duration-200",
                isSelected 
                  ? "bg-crd-green/20 border-crd-green text-white shadow-md" 
                  : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30"
              )}
              style={isSelected ? {
                borderColor: '#00C851',
                backgroundColor: '#00C85120',
                boxShadow: '0 0 15px #00C85130'
              } : {}}
            >
              <div className="text-xl">{template.emoji}</div>
              <div className="text-center">
                <div className="text-xs font-medium text-white">{template.name}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Up to {template.maxCards} cards
                </div>
              </div>
            </Button>
          );
        })}
      </div>
      
      {selectedTemplate && (
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{selectedTemplate.emoji}</span>
            <span className="text-white font-medium">{selectedTemplate.name}</span>
          </div>
          <p className="text-gray-400 text-xs">{selectedTemplate.description}</p>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Max cards: {selectedTemplate.maxCards}</span>
            <span className="capitalize">{selectedTemplate.category}</span>
          </div>
        </div>
      )}
    </div>
  );
};
