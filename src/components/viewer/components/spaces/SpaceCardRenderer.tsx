
import React from 'react';
import { EnhancedCardContainer } from '../EnhancedCardContainer';
import type { SpaceCard, SpaceTemplate } from '../../types/spaces';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../../types';

interface SpaceCardRendererProps {
  spaceCard: SpaceCard;
  index: number;
  template: SpaceTemplate;
  isHovering: boolean;
  isEditMode: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  overallBrightness: number[];
  interactiveLighting: boolean;
  onCardSelect: (cardId: string, multiSelect: boolean) => void;
}

export const SpaceCardRenderer: React.FC<SpaceCardRendererProps> = ({
  spaceCard,
  index,
  template,
  isHovering,
  isEditMode,
  effectValues,
  mousePosition,
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness,
  interactiveLighting,
  onCardSelect
}) => {
  // Generate frame styles
  const getFrameStyles = () => ({
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)'
  });

  // Generate enhanced effect styles
  const getEnhancedEffectStyles = () => ({
    filter: `brightness(${overallBrightness[0] / 100}) contrast(1.1)`,
    transition: 'all 0.3s ease'
  });

  // Surface texture component
  const SurfaceTexture = (
    <div 
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: template.category === 'museum' 
          ? 'linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%)'
          : 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: template.category === 'museum' ? '10px 10px' : '20px 20px'
      }}
    />
  );

  // Fixed 3D transform calculation - corrected scaling and rotation
  const getCardTransform = () => {
    const baseScale = 0.25; // Smaller scale for better fit
    const spacing = 120; // Increased spacing between cards
    
    // Calculate position based on template and card position
    const x = spaceCard.position.x * spacing;
    const y = -spaceCard.position.y * spacing; // Negative for proper Y orientation
    const z = spaceCard.position.z * 60;
    
    // Fixed rotation - cards should face forward (no crazy rotations)
    const rotX = spaceCard.rotation.x;
    const rotY = spaceCard.rotation.y;
    const rotZ = spaceCard.rotation.z;
    
    // Add subtle floating animation for constellation
    const floatY = template.category === 'constellation' 
      ? Math.sin(Date.now() * 0.001 + index) * 10 
      : 0;
    
    return `
      translate3d(${x}px, ${y + floatY}px, ${z}px)
      rotateX(${rotX}deg)
      rotateY(${rotY}deg)
      rotateZ(${rotZ}deg)
      scale(${baseScale * spaceCard.scale})
    `;
  };

  return (
    <div
      className={`absolute top-1/2 left-1/2 transition-all duration-500 ${
        spaceCard.isSelected ? 'ring-2 ring-crd-green ring-opacity-80' : ''
      } ${isEditMode ? 'cursor-pointer hover:scale-110' : ''}`}
      style={{
        transform: getCardTransform(),
        transformStyle: 'preserve-3d',
        zIndex: 10 + index + Math.floor(spaceCard.position.z * 5),
        filter: `drop-shadow(0 ${8 + spaceCard.position.z * 3}px ${16 + spaceCard.position.z * 6}px rgba(0,0,0,0.4))`
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (isEditMode) {
          onCardSelect(spaceCard.id, e.ctrlKey || e.metaKey);
        }
      }}
    >
      <EnhancedCardContainer
        card={spaceCard.card}
        isFlipped={false}
        isHovering={isHovering}
        showEffects={true}
        effectValues={effectValues}
        mousePosition={mousePosition}
        rotation={{ x: 0, y: 0 }}
        zoom={1}
        isDragging={false}
        frameStyles={getFrameStyles()}
        enhancedEffectStyles={getEnhancedEffectStyles()}
        SurfaceTexture={SurfaceTexture}
        interactiveLighting={interactiveLighting}
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        materialSettings={materialSettings}
        overallBrightness={overallBrightness}
        showBackgroundInfo={false}
        onMouseDown={() => {}}
        onMouseMove={() => {}}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
        onClick={() => {}}
      />
      
      {/* Enhanced selection indicator */}
      {spaceCard.isSelected && (
        <div className="absolute -inset-6 border-2 border-crd-green rounded-xl bg-crd-green/10 pointer-events-none">
          <div className="absolute inset-0 border border-crd-green/50 rounded-xl animate-pulse" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-crd-green rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
};
