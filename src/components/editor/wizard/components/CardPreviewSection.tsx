
import React from 'react';
import { ModularTemplatePreview } from './ModularTemplatePreview';
import { MODULAR_TEMPLATES } from '@/data/modularTemplates';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface CardPreviewSectionProps {
  selectedPhoto: string;
  selectedTemplate: DesignTemplate | null;
  cardData?: {
    title?: string;
    description?: string;
    rarity?: string;
  };
}

export const CardPreviewSection = ({ 
  selectedPhoto, 
  selectedTemplate,
  cardData = {}
}: CardPreviewSectionProps) => {
  // Find the modular template that corresponds to the selected template
  const modularTemplate = selectedTemplate 
    ? MODULAR_TEMPLATES.find(t => t.id === selectedTemplate.id)
    : null;

  if (!modularTemplate) {
    return (
      <div className="flex items-center justify-center h-96 bg-crd-mediumGray/30 rounded-lg border border-crd-mediumGray/50">
        <div className="text-center">
          <p className="text-crd-lightGray mb-2">No template selected</p>
          <p className="text-sm text-crd-lightGray/70">Choose a template to see your card preview</p>
        </div>
      </div>
    );
  }

  // Create custom elements with user data
  const customElements = modularTemplate.elements.map(element => {
    if (element.type === 'nameplate') {
      return {
        ...element,
        content: cardData.title || 'Your Card Title'
      };
    }
    if (element.type === 'textOverlay') {
      return {
        ...element,
        content: cardData.description || 'Card description will appear here'
      };
    }
    return element;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="transform hover:scale-105 transition-transform duration-200">
          <ModularTemplatePreview
            template={modularTemplate}
            selectedPhoto={selectedPhoto}
            customElements={customElements}
            className="w-80 h-112 shadow-2xl border border-crd-mediumGray/50"
          />
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-white font-medium mb-1">{modularTemplate.name}</h3>
        <p className="text-crd-lightGray text-sm">{modularTemplate.description}</p>
        {cardData.rarity && (
          <div className="mt-2">
            <span className="px-2 py-1 bg-crd-green/20 text-crd-green text-xs rounded-full">
              {cardData.rarity} Rarity
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
