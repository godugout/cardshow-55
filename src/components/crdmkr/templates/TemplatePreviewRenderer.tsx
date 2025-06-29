
import React from 'react';
import type { DetectedRegion } from '@/types/crdmkr';

interface TemplateConfig {
  layout: {
    padding: number;
    borderRadius: number;
    aspectRatio: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
  };
  effects: {
    shadow: boolean;
    glow: boolean;
    gradient: boolean;
    opacity: number;
  };
}

interface TemplatePreviewRendererProps {
  imageUrl: string;
  regions: DetectedRegion[];
  config: TemplateConfig;
  showOriginal?: boolean;
}

export const TemplatePreviewRenderer: React.FC<TemplatePreviewRendererProps> = ({
  imageUrl,
  regions,
  config,
  showOriginal = false
}) => {
  const containerStyle = {
    padding: `${config.layout.padding}px`,
    borderRadius: `${config.layout.borderRadius}px`,
    backgroundColor: config.colors.background,
    fontFamily: config.typography.fontFamily,
    opacity: config.effects.opacity / 100,
    boxShadow: config.effects.shadow ? '0 8px 32px rgba(0,0,0,0.3)' : 'none',
    filter: config.effects.glow ? `drop-shadow(0 0 20px ${config.colors.accent}40)` : 'none',
    background: config.effects.gradient 
      ? `linear-gradient(135deg, ${config.colors.primary}20, ${config.colors.secondary}20)`
      : config.colors.background
  };

  if (showOriginal) {
    return (
      <div className="relative w-full h-full">
        <img 
          src={imageUrl} 
          alt="Original" 
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full" style={containerStyle}>
      {/* Background Image with Styling */}
      <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: `${config.layout.borderRadius}px` }}>
        <img 
          src={imageUrl} 
          alt="Template Preview" 
          className="w-full h-full object-cover"
          style={{
            filter: `brightness(1.1) contrast(1.05)`,
          }}
        />
        
        {/* Template Overlays */}
        {regions.map((region) => (
          <div
            key={region.id}
            className="absolute transition-all duration-300"
            style={{
              left: `${(region.bounds.x / 375) * 100}%`,
              top: `${(region.bounds.y / 526) * 100}%`,
              width: `${(region.bounds.width / 375) * 100}%`,
              height: `${(region.bounds.height / 526) * 100}%`,
            }}
          >
            {region.type === 'text' && (
              <div 
                className="w-full h-full flex items-center justify-center text-center px-2"
                style={{
                  backgroundColor: `${config.colors.primary}15`,
                  border: `2px solid ${config.colors.primary}`,
                  borderRadius: `${config.layout.borderRadius / 2}px`,
                  color: config.colors.primary,
                  fontSize: `${config.typography.fontSize}px`,
                  fontWeight: config.typography.fontWeight,
                  fontFamily: config.typography.fontFamily,
                  lineHeight: config.typography.lineHeight,
                }}
              >
                <span className="text-xs opacity-75">Text Area</span>
              </div>
            )}
            
            {region.type === 'border' && (
              <div 
                className="w-full h-full pointer-events-none"
                style={{
                  border: `3px solid ${config.colors.accent}`,
                  borderRadius: `${config.layout.borderRadius}px`,
                }}
              />
            )}
            
            {region.type === 'logo' && (
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{
                  backgroundColor: `${config.colors.secondary}20`,
                  border: `2px dashed ${config.colors.secondary}`,
                  borderRadius: `${config.layout.borderRadius / 2}px`,
                }}
              >
                <span className="text-xs opacity-75" style={{ color: config.colors.secondary }}>
                  Logo Area
                </span>
              </div>
            )}
          </div>
        ))}
        
        {/* Template Effects Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: config.effects.gradient 
              ? `linear-gradient(135deg, ${config.colors.primary}10, transparent 50%, ${config.colors.accent}10)`
              : 'transparent',
            borderRadius: `${config.layout.borderRadius}px`,
          }}
        />
      </div>
      
      {/* Template Info Badge */}
      <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
        Template Applied
      </div>
    </div>
  );
};
