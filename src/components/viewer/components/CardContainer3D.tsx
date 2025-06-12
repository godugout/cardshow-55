
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { UnifiedCardViewer } from './UnifiedCardViewer';

interface CardContainer3DProps {
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
  isDragging: boolean;
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting: boolean;
  onClick: () => void;
}

export const CardContainer3D: React.FC<CardContainer3DProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  rotation,
  isDragging,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting,
  onClick
}) => {
  console.log('🎯 CardContainer3D now using UnifiedCard approach:', {
    cardTitle: card.title,
    isFlipped,
    rotation,
    showEffects
  });

  // Convert React mouse events to Three.js compatible format
  const handleMouseDown = React.useCallback((e: any) => {
    // Three.js events have different structure
    console.log('UnifiedCard mouse down');
  }, []);

  const handleMouseMove = React.useCallback((e: any) => {
    // Three.js events have different structure
    console.log('UnifiedCard mouse move');
  }, []);

  const handleMouseEnter = React.useCallback(() => {
    console.log('UnifiedCard mouse enter');
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    console.log('UnifiedCard mouse leave');
  }, []);

  return (
    <div
      className="relative"
      style={{
        width: '400px',
        height: '560px',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Unified Card Viewer replaces the old front/back container approach */}
      <UnifiedCardViewer
        card={card}
        effectValues={effectValues}
        mousePosition={mousePosition}
        rotation={rotation}
        zoom={1.0}
        isDragging={isDragging}
        isHovering={isHovering}
        showEffects={showEffects}
        interactiveLighting={interactiveLighting}
        frameStyles={frameStyles}
        enhancedEffectStyles={enhancedEffectStyles}
        SurfaceTexture={SurfaceTexture}
        environment="studio"
        autoRotate={false}
        enableControls={false}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      />
    </div>
  );
};
