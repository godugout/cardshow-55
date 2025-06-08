
import React from 'react';
import type { SpaceTemplate } from '../../types/spaces';

interface SpaceEnvironmentLayerProps {
  template: SpaceTemplate | null;
}

export const SpaceEnvironmentLayer: React.FC<SpaceEnvironmentLayerProps> = ({ template }) => {
  if (!template) return null;

  // Enhanced environment rendering with immersive 3D photography gallery backgrounds
  const getEnvironmentStyle = () => {
    const baseStyle = {
      background: template.environment.background,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100%',
      height: '100%'
    };

    // Enhanced category-specific environments for photography gallery immersion
    switch (template.category) {
      case 'gallery':
        return {
          ...baseStyle,
          background: `
            linear-gradient(180deg, rgba(20,20,20,0.95) 0%, rgba(35,35,35,0.98) 50%, rgba(20,20,20,0.95) 100%),
            radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.25) 0%, transparent 60%),
            radial-gradient(ellipse at 25% 100%, rgba(245,158,11,0.2) 0%, transparent 40%),
            radial-gradient(ellipse at 75% 100%, rgba(245,158,11,0.2) 0%, transparent 40%),
            linear-gradient(90deg, #252525 0%, #1a1a1a 50%, #252525 100%)
          `,
          boxShadow: 'inset 0 0 400px rgba(245,158,11,0.2)',
          position: 'relative' as const
        };
      case 'stadium':
        return {
          ...baseStyle,
          background: `
            radial-gradient(ellipse at center, rgba(10,15,20,0.9) 0%, rgba(20,30,40,0.98) 100%),
            linear-gradient(45deg, rgba(139,92,246,0.2) 0%, transparent 70%),
            linear-gradient(135deg, #1a252f 0%, #0f1419 100%)
          `,
          boxShadow: 'inset 0 0 500px rgba(139,92,246,0.25)'
        };
      case 'constellation':
        return {
          ...baseStyle,
          background: `
            radial-gradient(ellipse, rgba(5,5,25,0.98) 0%, rgba(0,0,0,1) 100%),
            radial-gradient(circle at 20% 30%, rgba(14,165,233,0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(6,182,212,0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(168,85,247,0.12) 0%, transparent 60%)
          `,
          boxShadow: 'inset 0 0 600px rgba(14,165,233,0.25)'
        };
      case 'museum':
        return {
          ...baseStyle,
          background: `
            linear-gradient(180deg, rgba(248,248,248,0.99) 0%, rgba(235,235,235,1) 100%),
            radial-gradient(circle at 50% 0%, rgba(107,114,128,0.2) 0%, transparent 70%),
            linear-gradient(90deg, #f8f8f8 0%, #ebebeb 50%, #f8f8f8 100%)
          `,
          boxShadow: 'inset 0 60px 120px rgba(107,114,128,0.25)'
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
      {/* Base Environment - full immersive coverage */}
      <div 
        className="absolute inset-0"
        style={getEnvironmentStyle()}
      />

      {/* Gallery Wall Enhanced Effects for Photography Display */}
      {template.category === 'gallery' && (
        <>
          {/* 3D Wall texture and museum-quality lighting */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.08) 50%, transparent 100%),
                repeating-linear-gradient(
                  90deg,
                  rgba(255,255,255,0.03) 0px,
                  rgba(255,255,255,0.03) 1px,
                  transparent 1px,
                  transparent 15px
                ),
                repeating-linear-gradient(
                  0deg,
                  rgba(255,255,255,0.02) 0px,
                  rgba(255,255,255,0.02) 1px,
                  transparent 1px,
                  transparent 20px
                )
              `,
              opacity: 0.9
            }}
          />
          
          {/* Museum-quality track lighting effects */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 30% 70% at 20% 8%, rgba(245,158,11,0.5) 0%, transparent 50%),
                radial-gradient(ellipse 30% 70% at 35% 8%, rgba(245,158,11,0.4) 0%, transparent 50%),
                radial-gradient(ellipse 30% 70% at 50% 8%, rgba(245,158,11,0.5) 0%, transparent 50%),
                radial-gradient(ellipse 30% 70% at 65% 8%, rgba(245,158,11,0.4) 0%, transparent 50%),
                radial-gradient(ellipse 30% 70% at 80% 8%, rgba(245,158,11,0.5) 0%, transparent 50%)
              `,
              opacity: 0.95
            }}
          />
          
          {/* Gallery floor reflection for depth */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
            style={{
              background: `
                linear-gradient(to top, rgba(245,158,11,0.2) 0%, transparent 100%),
                radial-gradient(ellipse at center bottom, rgba(245,158,11,0.3) 0%, transparent 80%)
              `,
              opacity: 0.8,
              transform: 'perspective(1000px) rotateX(85deg) translateZ(-50px)'
            }}
          />
        </>
      )}

      {/* Enhanced atmospheric fog and depth for all environments */}
      {template.environment.fog && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at center, transparent 20%, ${template.environment.fog.color}30 85%),
              radial-gradient(ellipse at 25% 60%, ${template.environment.fog.color}20 0%, transparent 40%),
              radial-gradient(ellipse at 75% 40%, ${template.environment.fog.color}20 0%, transparent 40%)
            `,
            opacity: 0.9,
            mixBlendMode: template.category === 'museum' ? 'normal' : 'multiply'
          }}
        />
      )}

      {/* Category-specific atmospheric depth layers */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: template.category === 'gallery' 
            ? `
              linear-gradient(180deg, transparent 0%, rgba(245,158,11,0.12) 100%),
              radial-gradient(circle at 50% 90%, rgba(245,158,11,0.18) 0%, transparent 70%)
            `
            : template.category === 'stadium'
            ? `
              radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%),
              linear-gradient(0deg, rgba(139,92,246,0.1) 0%, transparent 50%)
            `
            : template.category === 'constellation'
            ? `
              radial-gradient(circle at 25% 25%, rgba(14,165,233,0.12) 0%, transparent 35%),
              radial-gradient(circle at 75% 75%, rgba(6,182,212,0.12) 0%, transparent 35%),
              radial-gradient(circle at 50% 10%, rgba(168,85,247,0.1) 0%, transparent 40%)
            `
            : 'none',
          opacity: 0.95
        }}
      />

      {/* 3D Photography Gallery Spotlights (Gallery specific) */}
      {template.category === 'gallery' && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              conic-gradient(from 90deg at 20% 10%, transparent 60%, rgba(245,158,11,0.3) 70%, transparent 80%),
              conic-gradient(from 90deg at 50% 10%, transparent 60%, rgba(245,158,11,0.4) 70%, transparent 80%),
              conic-gradient(from 90deg at 80% 10%, transparent 60%, rgba(245,158,11,0.3) 70%, transparent 80%)
            `,
            opacity: 0.8
          }}
        />
      )}
    </div>
  );
};
