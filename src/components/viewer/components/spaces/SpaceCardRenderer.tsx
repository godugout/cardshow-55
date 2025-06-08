
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

  // Enhanced 3D transform calculation
  const baseTransform = `
    translate3d(${spaceCard.position.x * 60}px, ${-spaceCard.position.y * 60}px, ${spaceCard.position.z * 40}px)
    rotateX(${spaceCard.rotation.x + (template.category === 'constellation' ? Math.sin(Date.now() * 0.001 + index) * 2 : 0)}deg)
    rotateY(${spaceCard.rotation.y + (isHovering ? Math.sin(Date.now() * 0.002 + index) * 1 : 0)}deg)
    rotateZ(${spaceCard.rotation.z}deg)
    scale(${spaceCard.scale * 0.4})
  `;

  return (
    <div
      className={`absolute top-1/2 left-1/2 transition-all duration-300 ${
        spaceCard.isSelected ? 'ring-2 ring-crd-green ring-opacity-80' : ''
      } ${isEditMode ? 'cursor-pointer hover:scale-110' : ''}`}
      style={{
        transform: baseTransform,
        transformStyle: 'preserve-3d',
        zIndex: 10 + index + Math.floor(spaceCard.position.z * 5),
        filter: `drop-shadow(0 ${4 + spaceCard.position.z * 2}px ${8 + spaceCard.position.z * 4}px rgba(0,0,0,0.3))`
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (isEditMode) {
          onCardSelect(spaceCard.id, e.ctrlKey || e.metaKey);
        }
      }}
    >
      <div style={{ transform: 'scale(0.6)' }}>
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
      </div>
      
      {/* Enhanced selection indicator */}
      {spaceCard.isSelected && (
        <div className="absolute -inset-3 border-2 border-crd-green rounded-xl bg-crd-green/10 pointer-events-none">
          <div className="absolute inset-0 border border-crd-green/50 rounded-xl animate-pulse" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-crd-green rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
};
