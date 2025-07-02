
import React from 'react';
import type { CardBackMaterial } from '../hooks/useDynamicCardBackMaterials';

interface CardBackLogoProps {
  selectedMaterial: CardBackMaterial;
  isHovering: boolean;
  mousePosition: { x: number; y: number };
  interactiveLighting?: boolean;
}

export const CardBackLogo: React.FC<CardBackLogoProps> = ({
  selectedMaterial,
  isHovering,
  mousePosition,
  interactiveLighting = false
}) => {
  // Enhanced logo effects with proper flipping for back face
  const getLogoEffects = () => {
    const baseTreatment = selectedMaterial.logoTreatment;
    
    // Always flip the logo horizontally on the back face to correct mirroring
    const logoFlipTransform = 'scaleX(-1)';
    console.log('🔄 Logo Transform - Applying flip for back face');
    
    if (!interactiveLighting || !isHovering) {
      return {
        filter: baseTreatment.filter,
        transform: `${logoFlipTransform} ${baseTreatment.transform}`,
        opacity: baseTreatment.opacity,
        userSelect: 'none' as const,
        WebkitUserSelect: 'none' as const,
        pointerEvents: 'none' as const
      };
    }

    const intensity = Math.sqrt(
      Math.pow(mousePosition.x - 0.5, 2) + Math.pow(mousePosition.y - 0.5, 2)
    );
    
    return {
      filter: `
        ${baseTreatment.filter}
        drop-shadow(0 0 ${20 + intensity * 30}px rgba(255, 215, 0, ${0.3 + intensity * 0.4}))
        drop-shadow(0 0 ${40 + intensity * 60}px rgba(59, 130, 246, ${0.2 + intensity * 0.3}))
        brightness(${1 + intensity * 0.3})
        contrast(${1.1 + intensity * 0.2})
      `,
      transform: `${logoFlipTransform} ${baseTreatment.transform} scale(${1 + intensity * 0.05})`,
      opacity: baseTreatment.opacity + intensity * 0.1,
      userSelect: 'none' as const,
      WebkitUserSelect: 'none' as const,
      pointerEvents: 'none' as const
    };
  };

  return (
    <div 
      className="relative h-full flex items-center justify-center z-30"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        pointerEvents: 'none',
        backfaceVisibility: 'hidden'
      }}
    >
      <img 
        src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
        alt="CRD Logo" 
        className="w-64 h-auto relative z-10 transition-all duration-700 ease-out"
        style={{
          ...getLogoEffects(),
          imageRendering: 'crisp-edges',
          objectFit: 'contain',
          animation: interactiveLighting && isHovering ? 'logo-glow-pulse 4s ease-in-out infinite' : 'none',
          backfaceVisibility: 'hidden'
        }}
        onLoad={() => console.log('✅ Enhanced CRD logo loaded successfully (back face)')}
        onError={() => console.log('❌ Error loading enhanced CRD logo (back face)')}
        draggable={false}
      />
    </div>
  );
};
