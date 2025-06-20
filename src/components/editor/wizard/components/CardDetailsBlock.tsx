
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Layers, Sparkles } from 'lucide-react';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface CardDetailsBlockProps {
  selectedTemplate: DesignTemplate | null;
  imageFormat: 'square' | 'circle' | 'fullBleed';
}

export const CardDetailsBlock = ({ 
  selectedTemplate, 
  imageFormat 
}: CardDetailsBlockProps) => {
  if (!selectedTemplate) {
    return (
      <Card className="bg-crd-darkGray border-crd-mediumGray/30">
        <CardContent className="p-4">
          <div className="text-center text-crd-lightGray">
            <p className="text-sm">Select a frame to see card details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDisplayName = {
    fullBleed: 'Full Card',
    square: 'Square Crop',
    circle: 'Circle Crop'
  }[imageFormat];

  return (
    <Card className="bg-crd-darkGray border-crd-mediumGray/30">
      <CardContent className="p-4">
        <div className="space-y-3">
          <h4 className="text-white font-medium text-sm">Card Specs</h4>
          
          {/* Compact specs grid */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-crd-green/20 rounded flex items-center justify-center">
                <Palette className="w-3 h-3 text-crd-green" />
              </div>
              <div>
                <p className="text-white font-medium">{formatDisplayName}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-crd-blue/20 rounded flex items-center justify-center">
                <Layers className="w-3 h-3 text-crd-blue" />
              </div>
              <div>
                <p className="text-white font-medium">5 Elements</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-crd-orange/20 rounded flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-crd-orange" />
              </div>
              <div>
                <p className="text-white font-medium">Effects Ready</p>
              </div>
            </div>
          </div>

          {/* Template description */}
          <p className="text-crd-lightGray text-xs leading-relaxed">
            {selectedTemplate.name === "Common CRD" 
              ? "Versatile template perfect for sports cards and trading card collections. Features clean typography and flexible layout options."
              : "Professional template with customizable elements and effect compatibility."
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
