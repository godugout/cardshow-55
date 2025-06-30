
import React, { useState } from 'react';
import { SVGTemplateRenderer } from '@/components/editor/templates/SVGTemplateRenderer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { DesignTemplate } from '@/types/card';

// Default templates with proper CRD frame overlay and all required DesignTemplate properties
const DEFAULT_TEMPLATES = [
  {
    id: 'classic-baseball',
    name: 'Classic Baseball',
    category: 'sports' as const,
    template_data: {
      component: 'ClassicBaseballTemplate',
      colors: {
        primary: '#1a472a',
        secondary: '#2d5a3d',
        accent: '#4ade80',
        text: '#ffffff'
      }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'modern-baseball',
    name: 'Modern Baseball',
    category: 'sports' as const,
    template_data: {
      component: 'ModernBaseballTemplate',
      colors: {
        primary: '#1e293b',
        secondary: '#334155',
        accent: '#06b6d4',
        text: '#ffffff'
      }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'vintage-baseball',
    name: 'Vintage Baseball',
    category: 'sports' as const,
    template_data: {
      component: 'VintageBaseballTemplate',
      colors: {
        primary: '#7c2d12',
        secondary: '#9a3412',
        accent: '#f97316',
        text: '#ffffff'
      }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'no-frame',
    name: 'Clean Background',
    category: 'minimal' as const,
    template_data: {
      component: 'NoFrameTemplate',
      colors: {
        primary: '#000000',
        secondary: '#1f1f1f',
        accent: '#4ade80',
        text: '#ffffff'
      }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

interface CardPreviewRendererProps {
  imageUrl: string;
  template?: DesignTemplate | null;
  onTemplateChange?: (template: DesignTemplate) => void;
  enableFrameSwitching?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  playerName?: string;
  teamName?: string;
  position?: string;
}

export const CardPreviewRenderer: React.FC<CardPreviewRendererProps> = ({
  imageUrl,
  template,
  onTemplateChange,
  enableFrameSwitching = false,
  size = 'medium',
  className = '',
  playerName = 'Player Name',
  teamName = 'Team Name',
  position = 'Position'
}) => {
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  
  // Use provided template or default to first template
  const activeTemplate = template || DEFAULT_TEMPLATES[currentTemplateIndex];
  
  const sizeClasses = {
    small: 'w-48 h-64',
    medium: 'w-64 h-80',
    large: 'w-80 h-100'
  };

  const handlePreviousTemplate = () => {
    const newIndex = (currentTemplateIndex - 1 + DEFAULT_TEMPLATES.length) % DEFAULT_TEMPLATES.length;
    setCurrentTemplateIndex(newIndex);
    const newTemplate = DEFAULT_TEMPLATES[newIndex];
    onTemplateChange?.(newTemplate);
  };

  const handleNextTemplate = () => {
    const newIndex = (currentTemplateIndex + 1) % DEFAULT_TEMPLATES.length;
    setCurrentTemplateIndex(newIndex);
    const newTemplate = DEFAULT_TEMPLATES[newIndex];
    onTemplateChange?.(newTemplate);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Card Preview Container with proper aspect ratio */}
      <div className="relative">
        <div className={`${sizeClasses[size]} mx-auto relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-crd-mediumGray/20`}>
          {/* Full Image Background - Always visible */}
          <div className="absolute inset-0">
            <img
              src={imageUrl}
              alt="Card background"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center' }}
            />
            {/* Subtle overlay to ensure frame visibility */}
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          
          {/* CRD Frame Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <SVGTemplateRenderer
              template={activeTemplate}
              imageUrl={imageUrl}
              playerName={playerName}
              teamName={teamName}
              position={position}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Frame Switching Controls */}
        {enableFrameSwitching && (
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 pointer-events-none">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousTemplate}
              className="pointer-events-auto bg-black/80 border-white/20 text-white hover:bg-black/90"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextTemplate}
              className="pointer-events-auto bg-black/80 border-white/20 text-white hover:bg-black/90"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Template Info */}
      <div className="text-center">
        <Badge variant="outline" className="text-crd-green border-crd-green/30">
          {activeTemplate.name || 'Custom Template'}
        </Badge>
        {enableFrameSwitching && (
          <p className="text-crd-lightGray text-xs mt-2">
            Use arrows to switch frames • {currentTemplateIndex + 1}/{DEFAULT_TEMPLATES.length}
          </p>
        )}
      </div>
    </div>
  );
};
