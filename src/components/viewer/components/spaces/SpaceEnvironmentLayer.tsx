
import React from 'react';
import type { SpaceTemplate } from '../../types/spaces';

interface SpaceEnvironmentLayerProps {
  template: SpaceTemplate | null;
}

export const SpaceEnvironmentLayer: React.FC<SpaceEnvironmentLayerProps> = ({ template }) => {
  if (!template) return null;

  // Enhanced environment rendering based on template with full coverage
  const getEnvironmentStyle = () => {
    const baseStyle = {
      background: template.environment.background,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100%',
      height: '100%'
    };

    // Add category-specific enhancements for full 3D environment
    switch (template.category) {
      case 'gallery':
        return {
          ...baseStyle,
          background: `
            linear-gradient(180deg, rgba(26,26,26,0.9) 0%, rgba(45,45,45,0.95) 100%),
            radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.2) 0%, transparent 70%),
            radial-gradient(ellipse at 25% 100%, rgba(245,158,11,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 75% 100%, rgba(245,158,11,0.15) 0%, transparent 50%),
            linear-gradient(90deg, #2d2d2d 0%, #1a1a1a 50%, #2d2d2d 100%)
          `,
          boxShadow: 'inset 0 0 300px rgba(245,158,11,0.15)',
          position: 'relative' as const
        };
      case 'stadium':
        return {
          ...baseStyle,
          background: `
            radial-gradient(ellipse at center, rgba(15,20,25,0.8) 0%, rgba(26,37,47,0.95) 100%),
            linear-gradient(45deg, rgba(139,92,246,0.15) 0%, transparent 60%),
            linear-gradient(135deg, #1a252f 0%, #0f1419 100%)
          `,
          boxShadow: 'inset 0 0 400px rgba(139,92,246,0.2)'
        };
      case 'constellation':
        return {
          ...baseStyle,
          background: `
            radial-gradient(ellipse, rgba(10,10,35,0.95) 0%, rgba(0,0,0,1) 100%),
            radial-gradient(circle at 20% 30%, rgba(14,165,233,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(6,182,212,0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(168,85,247,0.08) 0%, transparent 60%)
          `,
          boxShadow: 'inset 0 0 500px rgba(14,165,233,0.2)'
        };
      case 'museum':
        return {
          ...baseStyle,
          background: `
            linear-gradient(180deg, rgba(245,245,245,0.98) 0%, rgba(224,224,224,0.99) 100%),
            radial-gradient(circle at 50% 0%, rgba(107,114,128,0.15) 0%, transparent 60%),
            linear-gradient(90deg, #f5f5f5 0%, #e0e0e0 50%, #f5f5f5 100%)
          `,
          boxShadow: 'inset 0 50px 100px rgba(107,114,128,0.2)'
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
      {/* Base Environment - full coverage */}
      <div 
        className="absolute inset-0"
        style={getEnvironmentStyle()}
      />

      {/* Gallery Wall Enhanced Effects */}
      {template.category === 'gallery' && (
        <>
          {/* Wall texture and depth */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.05) 50%, transparent 100%),
                repeating-linear-gradient(
                  90deg,
                  rgba(255,255,255,0.02) 0px,
                  rgba(255,255,255,0.02) 2px,
                  transparent 2px,
                  transparent 20px
                )
              `,
              opacity: 0.8
            }}
          />
          
          {/* Spotlight effects for gallery */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 40% 80% at 25% 10%, rgba(245,158,11,0.4) 0%, transparent 60%),
                radial-gradient(ellipse 40% 80% at 50% 10%, rgba(245,158,11,0.4) 0%, transparent 60%),
                radial-gradient(ellipse 40% 80% at 75% 10%, rgba(245,158,11,0.4) 0%, transparent 60%)
              `,
              opacity: 0.9
            }}
          />
          
          {/* Floor reflection */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
            style={{
              background: `
                linear-gradient(to top, rgba(245,158,11,0.15) 0%, transparent 100%),
                radial-gradient(ellipse at center bottom, rgba(245,158,11,0.25) 0%, transparent 70%)
              `,
              opacity: 0.7
            }}
          />
        </>
      )}

      {/* Enhanced atmospheric effects for all environments */}
      {template.environment.fog && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at center, transparent 30%, ${template.environment.fog.color}40 90%),
              radial-gradient(ellipse at 30% 70%, ${template.environment.fog.color}25 0%, transparent 50%),
              radial-gradient(ellipse at 70% 30%, ${template.environment.fog.color}25 0%, transparent 50%)
            `,
            opacity: 0.8,
            mixBlendMode: template.category === 'museum' ? 'normal' : 'multiply'
          }}
        />
      )}

      {/* Category-specific atmospheric layers */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: template.category === 'gallery' 
            ? `
              linear-gradient(180deg, transparent 0%, rgba(245,158,11,0.08) 100%),
              radial-gradient(circle at 50% 100%, rgba(245,158,11,0.12) 0%, transparent 80%)
            `
            : template.category === 'stadium'
            ? `
              radial-gradient(circle at 50% 50%, rgba(139,92,246,0.12) 0%, transparent 80%),
              linear-gradient(0deg, rgba(139,92,246,0.08) 0%, transparent 60%)
            `
            : template.category === 'constellation'
            ? `
              radial-gradient(circle at 30% 30%, rgba(14,165,233,0.1) 0%, transparent 40%),
              radial-gradient(circle at 70% 70%, rgba(6,182,212,0.1) 0%, transparent 40%),
              radial-gradient(circle at 50% 10%, rgba(168,85,247,0.08) 0%, transparent 50%)
            `
            : 'none',
          opacity: 0.9
        }}
      />
    </div>
  );
};
