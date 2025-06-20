
import React from 'react';
import { Palette, Layers, Sparkles } from 'lucide-react';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface CompactCardInfoBarProps {
  selectedTemplate: DesignTemplate | null;
  imageFormat: 'square' | 'circle' | 'fullBleed';
}

export const CompactCardInfoBar = ({ 
  selectedTemplate, 
  imageFormat 
}: CompactCardInfoBarProps) => {
  if (!selectedTemplate) {
    return null;
  }

  const formatDisplayName = {
    fullBleed: 'Full Card',
    square: 'Square',
    circle: 'Circle'
  }[imageFormat];

  return (
    <div className="flex items-center justify-center gap-6 py-2 px-4 bg-crd-darkGray/50 rounded border border-crd-mediumGray/30">
      {/* Format */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-crd-green/20 rounded flex items-center justify-center">
          <Palette className="w-3 h-3 text-crd-green" />
        </div>
        <div className="text-xs">
          <span className="text-white font-medium">{formatDisplayName}</span>
          <div className="text-crd-lightGray">Format</div>
        </div>
      </div>

      {/* Elements */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-crd-blue/20 rounded flex items-center justify-center">
          <Layers className="w-3 h-3 text-crd-blue" />
        </div>
        <div className="text-xs">
          <span className="text-white font-medium">5 Layers</span>
          <div className="text-crd-lightGray">Elements</div>
        </div>
      </div>

      {/* Effects */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-crd-orange/20 rounded flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-crd-orange" />
        </div>
        <div className="text-xs">
          <span className="text-white font-medium">Compatible</span>
          <div className="text-crd-lightGray">Effects</div>
        </div>
      </div>
    </div>
  );
};
