
import React from 'react';
import { EnhancedCardPreview } from './EnhancedCardPreview';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface CardPreviewSectionProps {
  selectedPhoto: string;
  selectedTemplate: DesignTemplate | null;
}

export const CardPreviewSection = ({ selectedPhoto, selectedTemplate }: CardPreviewSectionProps) => {
  return (
    <div className="space-y-6">
      <EnhancedCardPreview
        selectedPhoto={selectedPhoto}
        selectedTemplate={selectedTemplate}
        cardData={{
          title: 'Your Card Title',
          description: 'Card description will appear here',
          rarity: 'rare'
        }}
      />
    </div>
  );
};
