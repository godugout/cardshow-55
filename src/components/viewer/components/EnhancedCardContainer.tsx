
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings, EnvironmentControls } from '../types';
import { CardFrontContainer } from './CardFrontContainer';
import { CardBackContainer } from './CardBackContainer';
import { CardEdgeContainer } from './CardEdgeContainer';
import { Card3DTransform } from './Card3DTransform';
import { useDefaultEffectValues } from '../hooks/useDefaultEffectValues';

interface EnhancedCardContainerProps {
  card: CardData;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting?: boolean;
  selectedScene?: EnvironmentScene;
  selectedLighting?: LightingPreset;
  materialSettings?: MaterialSettings;
  overallBrightness?: number[];
  showBackgroundInfo?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  environmentControls?: EnvironmentControls;
}

export const EnhancedCardContainer: React.FC<EnhancedCardContainerProps> = ({
  card,
  isHovering,
  showEffects,
  effectValues: rawEffectValues,
  mousePosition,
  rotation,
  zoom,
  isDragging,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting = false,
  onMouseDown,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick
}) => {
  // Use default values to prevent undefined errors
  const effectValues = useDefaultEffectValues(rawEffectValues);
  
  console.log('🎨 Enhanced Card Container - Effect Values:', effectValues);

  return (
    <div 
      className={`relative z-20 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        transform: `scale(${zoom})`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
        filter: `brightness(${interactiveLighting && isHovering ? 1.3 : 1.2}) contrast(1.1)`
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Card3DTransform
        rotation={rotation}
        mousePosition={mousePosition}
        isDragging={isDragging}
        interactiveLighting={interactiveLighting}
        isHovering={isHovering}
        onClick={onClick}
      >
        {/* Front of Card */}
        <CardFrontContainer
          card={card}
          rotation={rotation}
          isHovering={isHovering}
          showEffects={showEffects}
          effectValues={effectValues}
          mousePosition={mousePosition}
          frameStyles={frameStyles}
          enhancedEffectStyles={enhancedEffectStyles}
          SurfaceTexture={SurfaceTexture}
          interactiveLighting={interactiveLighting}
          onClick={onClick}
        />

        {/* Back of Card */}
        <CardBackContainer
          rotation={rotation}
          isHovering={isHovering}
          showEffects={showEffects}
          effectValues={effectValues}
          mousePosition={mousePosition}
          frameStyles={frameStyles}
          enhancedEffectStyles={enhancedEffectStyles}
          SurfaceTexture={SurfaceTexture}
          interactiveLighting={interactiveLighting}
        />

        {/* Card Edge with Glowing Gas */}
        <CardEdgeContainer
          rotation={rotation}
          isHovering={isHovering}
          effectValues={effectValues}
          mousePosition={mousePosition}
          interactiveLighting={interactiveLighting}
          zoom={zoom}
        />
      </Card3DTransform>
    </div>
  );
};

EnhancedCardContainer.displayName = 'EnhancedCardContainer';
