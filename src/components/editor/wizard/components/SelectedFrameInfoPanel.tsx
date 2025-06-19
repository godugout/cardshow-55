
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Palette, Layers, Sparkles } from 'lucide-react';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface SelectedFrameInfoPanelProps {
  selectedTemplate: DesignTemplate | null;
  imageFormat: 'square' | 'circle' | 'fullBleed';
}

export const SelectedFrameInfoPanel = ({ 
  selectedTemplate, 
  imageFormat 
}: SelectedFrameInfoPanelProps) => {
  if (!selectedTemplate) {
    return null;
  }

  const formatDisplayName = {
    fullBleed: 'Full Card',
    square: 'Square Crop',
    circle: 'Circle Crop'
  }[imageFormat];

  return (
    <Card className="bg-crd-darkGray border-crd-mediumGray/30">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-medium text-lg">
                  {selectedTemplate.name === "Cardshow Nostalgia" ? "Common CRD" : selectedTemplate.name}
                </h3>
                {selectedTemplate.name.includes('premium') && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0">
                    <Star className="w-3 h-3 mr-1" />
                    Pro
                  </Badge>
                )}
              </div>
              <p className="text-crd-lightGray text-sm leading-relaxed">
                A versatile template perfect for sports cards and trading card collections. 
                Features clean typography and flexible layout options.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 bg-crd-green/20 rounded-lg flex items-center justify-center">
                <Palette className="w-4 h-4 text-crd-green" />
              </div>
              <div>
                <p className="text-white font-medium">Format</p>
                <p className="text-crd-lightGray text-xs">{formatDisplayName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 bg-crd-blue/20 rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-crd-blue" />
              </div>
              <div>
                <p className="text-white font-medium">Elements</p>
                <p className="text-crd-lightGray text-xs">5 Layers</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 bg-crd-orange/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-crd-orange" />
              </div>
              <div>
                <p className="text-white font-medium">Effects</p>
                <p className="text-crd-lightGray text-xs">Compatible</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-crd-mediumGray/30">
            <div className="text-xs text-crd-lightGray">
              Optimized for {imageFormat === 'fullBleed' ? 'full card' : 'cropped'} photos
            </div>
            <div className="flex items-center gap-1 text-crd-green text-xs">
              ✓ Ready to customize
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
