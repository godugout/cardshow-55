
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { CardContainer3D } from './CardContainer3D';
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
  onMouseDown,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick,
  gripPoint,
  physicsState,
  rotationIndicator
}) => {
  const [localIsFlipped, setLocalIsFlipped] = React.useState(isFlipped);

  console.log('🎯 SimplifiedEnhancedCardContainer rendering with enhanced 360° and smart click detection:', {
    cardTitle: card.title,
    cardImage: card.image_url,
    isFlipped: localIsFlipped,
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

  // Enhanced mouse down handler with smart click detection preparation
  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onMouseDown(e);
  }, [onMouseDown]);

  // Enhanced click handler with smart detection
  const handleClick = React.useCallback((e: React.MouseEvent) => {
    // Only flip if this was a true click (not a drag)
    const wasClick = physicsState?.dragDistance < 5;
    
    if (wasClick) {
      console.log('🎯 Smart click detected - flipping card');
      setLocalIsFlipped(prev => !prev);
      onClick();
    }
  }, [physicsState?.dragDistance, onClick]);

  // Create a no-parameter version for CardContainer3D
  const handleCardClick = React.useCallback(() => {
    // Only flip if this was a true click (not a drag)
    const wasClick = physicsState?.dragDistance < 5;
    
    if (wasClick) {
      console.log('🎯 Smart click detected - flipping card');
      setLocalIsFlipped(prev => !prev);
      onClick();
    }
  }, [physicsState?.dragDistance, onClick]);

  // Cursor style based on interaction state
  const getCursorStyle = () => {
    if (isDragging) return 'cursor-grabbing';
    if (isHovering) return 'cursor-grab';
    return 'cursor-pointer';
  };

  return (
    <div 
      className={`relative select-none ${getCursorStyle()}`}
      style={{
        transform: `scale(${zoom})`,
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 10,
        width: `${containerWidth}px`,
        height: `${containerHeight}px`
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
    >
      <CardContainer3D
        card={card}
        isFlipped={localIsFlipped}
        isHovering={isHovering}
        showEffects={showEffects}
        effectValues={effectValues}
        mousePosition={mousePosition}
        rotation={rotation}
        isDragging={isDragging}
        frameStyles={frameStyles}
        enhancedEffectStyles={enhancedEffectStyles}
        SurfaceTexture={SurfaceTexture}
        interactiveLighting={interactiveLighting}
        onClick={handleCardClick}
      />
      
      {/* Enhanced Grip Feedback with improved 360° support */}
      <GripFeedback
        gripPoint={gripPoint}
        isGripping={physicsState?.isGripping || false}
        containerWidth={containerWidth}
        containerHeight={containerHeight}
      />
      
      {/* Enhanced Rotation Indicator */}
      {rotationIndicator && (
        <RotationIndicator
          show={rotationIndicator.show}
          angle={rotationIndicator.angle}
          position="top-right"
        />
      )}
      
      {/* Enhanced Physics Debug Info */}
      {physicsState && isDragging && (
        <div className="absolute bottom-2 left-2 text-xs text-white/60 font-mono bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
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
        <div className="absolute bottom-2 right-2 text-xs text-white/40 font-mono bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
          Click to flip • Drag to rotate
        </div>
      )}
    </div>
  );
};
