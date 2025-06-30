
import React from 'react';
import { SVGTemplateRenderer } from '@/components/editor/templates/SVGTemplateRenderer';
import type { DesignTemplate } from '@/types/card';

interface CardPreviewRendererProps {
  imageUrl: string;
  template: DesignTemplate;
  className?: string;
}

export const CardPreviewRenderer: React.FC<CardPreviewRendererProps> = ({
  imageUrl,
  template,
  className = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="aspect-[5/7] bg-white rounded-lg overflow-hidden shadow-lg border border-crd-mediumGray/20">
        <SVGTemplateRenderer
          template={template}
          imageUrl={imageUrl}
          className="w-full h-full"
        />
      </div>
      
      {/* Card Info Overlay */}
      <div className="absolute top-2 right-2 bg-crd-darkest/80 backdrop-blur-sm rounded-lg px-2 py-1">
        <div className="text-crd-green text-xs font-medium">
          {template.name}
        </div>
      </div>
    </div>
  );
};
