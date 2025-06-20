
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StylePreset {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  premium?: boolean;
  effects: string[];
}

interface StylePresetGridProps {
  selectedStyle: string;
  onStyleSelect: (styleId: string) => void;
  previewImage?: string;
}

const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Simple and elegant design',
    thumbnail: '/api/placeholder/200/280',
    effects: ['Clean borders', 'Subtle shadow']
  },
  {
    id: 'classic-frame',
    name: 'Classic Frame',
    description: 'Traditional card design',
    thumbnail: '/api/placeholder/200/280',
    effects: ['Gold frame', 'Classic typography']
  },
  {
    id: 'modern-gradient',
    name: 'Modern Gradient',
    description: 'Contemporary gradient background',
    thumbnail: '/api/placeholder/200/280',
    premium: true,
    effects: ['Gradient overlay', 'Modern fonts']
  },
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Shimmering holographic effect',
    thumbnail: '/api/placeholder/200/280',
    premium: true,
    effects: ['Holographic foil', 'Rainbow effects']
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Retro-inspired design',
    thumbnail: '/api/placeholder/200/280',
    effects: ['Aged texture', 'Vintage colors']
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Vibrant neon styling',
    thumbnail: '/api/placeholder/200/280',
    premium: true,
    effects: ['Neon glow', 'Electric colors']
  }
];

export const StylePresetGrid = ({ 
  selectedStyle, 
  onStyleSelect, 
  previewImage 
}: StylePresetGridProps) => {
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {STYLE_PRESETS.map((preset) => (
        <Card
          key={preset.id}
          className={`cursor-pointer transition-all duration-200 ${
            selectedStyle === preset.id
              ? 'ring-2 ring-crd-green bg-crd-darker border-crd-green'
              : 'bg-crd-darker border-crd-mediumGray/30 hover:border-crd-lightGray hover:bg-crd-mediumGray/10'
          }`}
          onClick={() => onStyleSelect(preset.id)}
        >
          <div className="p-4 space-y-3">
            {/* Thumbnail */}
            <div className="relative">
              <div className="w-full h-32 bg-crd-mediumGray/30 rounded-lg overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt={preset.name}
                    className="w-full h-full object-cover"
                    style={{
                      filter: preset.id === 'vintage' ? 'sepia(0.3)' : 
                              preset.id === 'neon' ? 'hue-rotate(45deg) saturate(1.5)' : 'none'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-crd-mediumGray">
                    Preview
                  </div>
                )}
              </div>
              
              {preset.premium && (
                <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs">
                  PRO
                </Badge>
              )}
              
              {selectedStyle === preset.id && (
                <div className="absolute inset-0 bg-crd-green/20 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 bg-crd-green rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            
            {/* Info */}
            <div className="space-y-2">
              <h4 className="font-medium text-white text-sm">{preset.name}</h4>
              <p className="text-xs text-crd-lightGray">{preset.description}</p>
              
              {/* Effects tags */}
              <div className="flex flex-wrap gap-1">
                {preset.effects.slice(0, 2).map((effect) => (
                  <span
                    key={effect}
                    className="text-xs px-2 py-1 bg-crd-mediumGray/20 text-crd-lightGray rounded"
                  >
                    {effect}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
