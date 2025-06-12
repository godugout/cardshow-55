
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { UnifiedCardViewer } from './UnifiedCardViewer';
import { GripFeedback } from './GripFeedback';
import { RotationIndicator } from './RotationIndicator';

interface SimplifiedEnhancedCardContainerProps {
  card: CardData;
  isFlipped: boolean;
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
  interactiveLighting: boolean;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  overallBrightness: number[];
  environmentControls: any;
  showBackgroundInfo: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  gripPoint?: { x: number; y: number } | null;
  physicsState?: any;
  rotationIndicator?: { show: boolean; angle: number };
}

export const SimplifiedEnhancedCardContainer: React.FC<SimplifiedEnhancedCardContainerProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  rotation,
  zoom,
  isDragging,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting,
  selectedScene,
  onMouseDown,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick,
  gripPoint,
  physicsState,
  rotationIndicator
}) => {
  console.log('🎯 SimplifiedEnhancedCardContainer using UnifiedCard approach:', {
    cardTitle: card.title,
    cardImage: card.image_url,
    isFlipped,
    zoom,
    rotation,
    gripPoint,
    hasPhysics: !!physicsState,
    rotationIndicator
  });

  const containerWidth = 400;
  const containerHeight = 560;

  // Calculate total effect intensity for physics feedback
  const totalEffectIntensity = React.useMemo(() => {
    if (!effectValues) return 0;
    return Object.values(effectValues).reduce((total, effect) => {
      const intensity = effect.intensity as number;
      return total + (typeof intensity === 'number' ? intensity : 0);
    }, 0);
  }, [effectValues]);

  // Convert mouse events for Three.js compatibility
  const handleThreeJSMouseDown = React.useCallback((e: any) => {
    const syntheticEvent = {
      preventDefault: () => {},
      clientX: e.point?.x || 0,
      clientY: e.point?.y || 0,
      target: e.object
    };
    onMouseDown(syntheticEvent as any);
  }, [onMouseDown]);

  const handleThreeJSMouseMove = React.useCallback((e: any) => {
    const syntheticEvent = {
      preventDefault: () => {},
      clientX: e.point?.x || 0,
      clientY: e.point?.y || 0,
      target: e.object
    };
    onMouseMove(syntheticEvent as any);
  }, [onMouseMove]);

  // Get environment string from selectedScene
  const environmentPreset = selectedScene?.preset || 'studio';

  return (
    <div 
      className="relative select-none"
      style={{
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
        zIndex: 10
      }}
    >
      {/* Unified Card Viewer with Three.js */}
      <UnifiedCardViewer
        card={card}
        effectValues={effectValues}
        mousePosition={mousePosition}
        rotation={rotation}
        zoom={zoom}
        isDragging={isDragging}
        isHovering={isHovering}
        showEffects={showEffects}
        interactiveLighting={interactiveLighting}
        frameStyles={frameStyles}
        enhancedEffectStyles={enhancedEffectStyles}
        SurfaceTexture={SurfaceTexture}
        environment={environmentPreset}
        autoRotate={false}
        enableControls={false}
        onMouseDown={handleThreeJSMouseDown}
        onMouseMove={handleThreeJSMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      />
      
      {/* Enhanced Grip Feedback */}
      <div className="absolute inset-0 pointer-events-none">
        <GripFeedback
          gripPoint={gripPoint}
          isGripping={physicsState?.isGripping || false}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
        />
      </div>
      
      {/* Enhanced Rotation Indicator */}
      {rotationIndicator && (
        <div className="absolute inset-0 pointer-events-none">
          <RotationIndicator
            show={rotationIndicator.show}
            angle={rotationIndicator.angle}
            position="top-right"
          />
        </div>
      )}
      
      {/* Enhanced Physics Debug Info */}
      {physicsState && isDragging && (
        <div className="absolute bottom-2 left-2 text-xs text-white/60 font-mono bg-black/30 px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
          <div>Angular V: {Math.round(physicsState.angularVelocity?.x * 100) || 0}, {Math.round(physicsState.angularVelocity?.y * 100) || 0}</div>
          <div>Sensitivity: {((1 + totalEffectIntensity * 0.3) * 1.8).toFixed(1)}x</div>
          <div>Drag: {Math.round(physicsState.dragDistance || 0)}px</div>
        </div>
      )}
      
      {/* Enhanced Velocity Indicator for Flick Gestures */}
      {physicsState?.angularVelocity && (Math.abs(physicsState.angularVelocity.x) > 3 || Math.abs(physicsState.angularVelocity.y) > 3) && (
        <div className="absolute top-2 left-2 z-40 pointer-events-none">
          <div className="w-3 h-3 bg-crd-primary rounded-full animate-pulse opacity-80">
            <div className="absolute inset-0 bg-crd-primary rounded-full animate-ping"></div>
          </div>
        </div>
      )}

      {/* Smart Click Indicator */}
      {!isDragging && isHovering && (
        <div className="absolute bottom-2 right-2 text-xs text-white/40 font-mono bg-black/20 px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
          Click to flip • Drag to rotate
        </div>
      )}
    </div>
  );
};
