
import React from 'react';
import { Card } from '@/types/card';
import { Button } from '@/components/ui/button';

interface TemplateSelectionStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
  onValidationChange: (isValid: boolean) => void;
}

const TEMPLATES = [
  { id: 'sports', name: 'Sports Card', preview: '/api/placeholder/300/400' },
  { id: 'gaming', name: 'Gaming Card', preview: '/api/placeholder/300/400' },
  { id: 'entertainment', name: 'Entertainment Card', preview: '/api/placeholder/300/400' },
  { id: 'custom', name: 'Custom Design', preview: '/api/placeholder/300/400' }
];

export const TemplateSelectionStep: React.FC<TemplateSelectionStepProps> = ({
  cardData,
  onUpdate,
  onValidationChange
}) => {
  const selectedTemplate = cardData.template_id;

  React.useEffect(() => {
    onValidationChange(Boolean(selectedTemplate));
  }, [selectedTemplate, onValidationChange]);

  const handleTemplateSelect = (templateId: string) => {
    onUpdate({ template_id: templateId });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-2">Choose Template</h2>
        <p className="text-crd-lightGray">
          Select a template that best fits your card design
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TEMPLATES.map((template) => (
          <div
            key={template.id}
            className={`
              relative bg-crd-mediumGray rounded-lg p-4 cursor-pointer transition-all duration-200
              hover:bg-crd-mediumGray/80 border-2
              ${selectedTemplate === template.id 
                ? 'border-crd-green bg-crd-green/10' 
                : 'border-transparent'
              }
            `}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <div className="aspect-[2.5/3.5] bg-crd-darkGray rounded mb-3 overflow-hidden">
              <img 
                src={template.preview} 
                alt={template.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-white font-medium text-center">{template.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};
