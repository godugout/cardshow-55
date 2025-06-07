
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { LightingPreset } from '../types';

interface LightingStyleCardsProps {
  selectedLighting: LightingPreset;
  onLightingChange: (lighting: LightingPreset) => void;
}

// Exact colors and styles from the image
const LIGHTING_STYLES = [
  {
    id: 'natural',
    name: 'Natural',
    description: 'Soft, realistic lighting that enhances natural colors',
    bgColor: '#22c55e',
    bgColorHover: '#16a34a',
    dots: ['#4ade80', '#22c55e', '#15803d']
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'High contrast lighting with deep shadows',
    bgColor: '#374151',
    bgColorHover: '#4b5563',
    dots: ['#6b7280', '#374151', '#1f2937']
  },
  {
    id: 'soft',
    name: 'Soft',
    description: 'Gentle, diffused lighting for a warm feel',
    bgColor: '#60a5fa',
    bgColorHover: '#3b82f6',
    dots: ['#93c5fd', '#60a5fa', '#2563eb']
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Bold, saturated lighting with rich colors',
    bgColor: '#8b5cf6',
    bgColorHover: '#7c3aed',
    dots: ['#a78bfa', '#8b5cf6', '#6d28d9']
  }
];

export const LightingStyleCards: React.FC<LightingStyleCardsProps> = ({
  selectedLighting,
  onLightingChange
}) => {
  const handleLightingSelect = (styleId: string) => {
    // Find the corresponding preset or create a basic one
    const lightingPreset: LightingPreset = {
      id: styleId,
      name: LIGHTING_STYLES.find(s => s.id === styleId)?.name || styleId,
      intensity: 1.0,
      color: '#ffffff',
      position: { x: 0, y: 0, z: 1 }
    };
    onLightingChange(lightingPreset);
  };

  return (
    <div className="space-y-3">
      {LIGHTING_STYLES.map((style) => {
        const isSelected = selectedLighting.id === style.id;
        
        return (
          <Button
            key={style.id}
            onClick={() => handleLightingSelect(style.id)}
            variant="ghost"
            className={cn(
              "w-full h-auto p-4 rounded-lg transition-all duration-200",
              "border-0 hover:scale-[1.02]",
              isSelected && "ring-2 ring-white/50 shadow-lg"
            )}
            style={{
              backgroundColor: isSelected ? style.bgColor : style.bgColor + '80',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = style.bgColorHover + '90';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = style.bgColor + '80';
              }
            }}
          >
            <div className="flex items-center justify-between w-full">
              {/* Left side - Text content */}
              <div className="flex flex-col items-start text-left">
                <span className="font-semibold text-base text-white">
                  {style.name}
                </span>
                <span className="text-sm text-white/90 mt-1 leading-tight">
                  {style.description}
                </span>
              </div>
              
              {/* Right side - Color dots */}
              <div className="flex items-center space-x-2 ml-4">
                {style.dots.map((dotColor, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-full border border-white/20"
                    style={{ backgroundColor: dotColor }}
                  />
                ))}
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
};
