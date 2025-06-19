
import React from 'react';
import { Button } from '@/components/ui/button';
import { Square, Circle, Maximize } from 'lucide-react';

interface ImageFormatSelectorProps {
  selectedFormat: 'square' | 'circle' | 'fullBleed';
  onFormatChange: (format: 'square' | 'circle' | 'fullBleed') => void;
  className?: string;
}

export const ImageFormatSelector = ({ 
  selectedFormat, 
  onFormatChange, 
  className = "" 
}: ImageFormatSelectorProps) => {
  const formats = [
    {
      id: 'fullBleed' as const,
      name: 'Full Bleed',
      icon: Maximize,
      description: 'Full image with overlays'
    },
    {
      id: 'square' as const,
      name: 'Square',
      icon: Square,
      description: 'Square crop with borders'
    },
    {
      id: 'circle' as const,
      name: 'Circle',
      icon: Circle,
      description: 'Circular crop with frame'
    }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="text-center">
        <h4 className="text-white font-medium mb-1">Image Format</h4>
        <p className="text-crd-lightGray text-xs">
          Choose how your image appears on the card
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {formats.map((format) => {
          const Icon = format.icon;
          const isSelected = selectedFormat === format.id;
          
          return (
            <Button
              key={format.id}
              onClick={() => onFormatChange(format.id)}
              variant="outline"
              className={`p-3 h-auto flex flex-col items-center gap-2 ${
                isSelected 
                  ? 'bg-crd-blue/20 border-crd-blue text-crd-blue' 
                  : 'bg-crd-mediumGray/20 border-crd-mediumGray/50 text-crd-lightGray hover:bg-crd-mediumGray/40'
              }`}
            >
              <Icon className="w-5 h-5" />
              <div className="text-center">
                <div className="text-xs font-medium">{format.name}</div>
                <div className="text-xs opacity-70">{format.description}</div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
