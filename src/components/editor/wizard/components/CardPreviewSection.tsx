
import React, { useState } from 'react';
import { AdaptiveTemplatePreview } from './AdaptiveTemplatePreview';
import { ImageFormatSelector } from './ImageFormatSelector';
import { ADAPTIVE_TEMPLATES } from '@/data/adaptiveTemplates';
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
  const [imageFormat, setImageFormat] = useState<'square' | 'circle' | 'fullBleed'>('fullBleed');

  // Find the adaptive template that corresponds to the selected template
  const adaptiveTemplate = selectedTemplate 
    ? ADAPTIVE_TEMPLATES.find(t => t.id === selectedTemplate.id)
    : null;

  if (!adaptiveTemplate) {
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
  const customElements = adaptiveTemplate.elements.map(element => {
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
      {/* Format Selection */}
      {selectedPhoto && (
        <div className="max-w-sm mx-auto">
          <ImageFormatSelector
            selectedFormat={imageFormat}
            onFormatChange={setImageFormat}
          />
        </div>
      )}
      
      <div className="flex justify-center">
        <div className="transform hover:scale-105 transition-transform duration-200">
          <AdaptiveTemplatePreview
            template={adaptiveTemplate}
            selectedPhoto={selectedPhoto}
            imageFormat={imageFormat}
            customElements={customElements}
            className="w-80 h-112 shadow-2xl border border-crd-mediumGray/50"
          />
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-white font-medium mb-1">{adaptiveTemplate.name}</h3>
        <p className="text-crd-lightGray text-sm">{adaptiveTemplate.description}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="px-2 py-1 bg-crd-blue/20 text-crd-blue text-xs rounded-full">
            {imageFormat.charAt(0).toUpperCase() + imageFormat.slice(1)} Format
          </span>
          {cardData.rarity && (
            <span className="px-2 py-1 bg-crd-green/20 text-crd-green text-xs rounded-full">
              {cardData.rarity} Rarity
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
