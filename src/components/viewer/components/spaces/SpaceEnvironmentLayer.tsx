
import React from 'react';
import type { SpaceTemplate } from '../../types/spaces';

interface SpaceEnvironmentLayerProps {
  template: SpaceTemplate | null;
}

export const SpaceEnvironmentLayer: React.FC<SpaceEnvironmentLayerProps> = ({ template }) => {
  if (!template) return null;

  // Enhanced environment rendering based on template
  const getEnvironmentStyle = () => {
    const baseStyle = {
      background: template.environment.background,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };

    // Add category-specific enhancements
    switch (template.category) {
      case 'gallery':
        return {
          ...baseStyle,
          background: `
            linear-gradient(180deg, rgba(26,26,26,0.8) 0%, rgba(45,45,45,0.9) 100%),
            radial-gradient(circle at 50% 20%, rgba(245,158,11,0.1) 0%, transparent 50%),
            ${template.environment.background}
          `,
          boxShadow: 'inset 0 0 100px rgba(245,158,11,0.05)'
        };
      case 'stadium':
        return {
          ...baseStyle,
          background: `
            radial-gradient(ellipse at center, rgba(15,20,25,0.7) 0%, rgba(26,37,47,0.9) 100%),
            linear-gradient(45deg, rgba(139,92,246,0.1) 0%, transparent 50%),
            ${template.environment.background}
          `,
          boxShadow: 'inset 0 0 150px rgba(139,92,246,0.1)'
        };
      case 'constellation':
        return {
          ...baseStyle,
          background: `
            radial-gradient(ellipse, rgba(10,10,35,0.9) 0%, rgba(0,0,0,1) 100%),
            radial-gradient(circle at 20% 30%, rgba(14,165,233,0.1) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(6,182,212,0.1) 0%, transparent 40%),
            ${template.environment.background}
          `,
          boxShadow: 'inset 0 0 200px rgba(14,165,233,0.1)'
        };
      case 'museum':
        return {
          ...baseStyle,
          background: `
            linear-gradient(180deg, rgba(245,245,245,0.95) 0%, rgba(224,224,224,0.98) 100%),
            radial-gradient(circle at 50% 0%, rgba(107,114,128,0.1) 0%, transparent 50%),
            ${template.environment.background}
          `,
          boxShadow: 'inset 0 20px 40px rgba(107,114,128,0.1)'
        };
      default:
        return baseStyle;
    }
  };

  return (
    <>
      {/* Base Environment */}
      <div 
        className="absolute inset-0"
        style={getEnvironmentStyle()}
      />

      {/* Enhanced environment effects */}
      {template.environment.fog && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at center, transparent 30%, ${template.environment.fog.color}60 70%),
              radial-gradient(ellipse at 20% 80%, ${template.environment.fog.color}40 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, ${template.environment.fog.color}40 0%, transparent 50%)
            `,
            opacity: 0.8,
            mixBlendMode: 'multiply'
          }}
        />
      )}

      {/* Lighting effects based on template category */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: template.category === 'gallery' 
            ? `
              radial-gradient(circle at 50% 0%, rgba(245,158,11,0.2) 0%, transparent 40%),
              radial-gradient(circle at 25% 100%, rgba(245,158,11,0.1) 0%, transparent 30%),
              radial-gradient(circle at 75% 100%, rgba(245,158,11,0.1) 0%, transparent 30%)
            `
            : template.category === 'stadium'
            ? `
              radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 60%),
              linear-gradient(0deg, rgba(139,92,246,0.1) 0%, transparent 40%)
            `
            : template.category === 'constellation'
            ? `
              radial-gradient(circle at 30% 30%, rgba(14,165,233,0.1) 0%, transparent 20%),
              radial-gradient(circle at 70% 70%, rgba(6,182,212,0.1) 0%, transparent 20%),
              radial-gradient(circle at 50% 10%, rgba(168,85,247,0.05) 0%, transparent 30%)
            `
            : 'none',
          opacity: 0.7
        }}
      />
    </>
  );
};
