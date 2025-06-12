
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { CardContainer3D } from './CardContainer3D';
import { GripFeedback } from './GripFeedback';
import { RotationIndicator } from './RotationIndicator';
import { useDoubleClick } from '@/hooks/useDoubleClick';

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

  console.log('🎯 SimplifiedEnhancedCardContainer rendering with enhanced touch gestures and high sensitivity:', {
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

  // Enhanced double-click handler for card flip
  const handleDoubleClick = useDoubleClick({
    onDoubleClick: () => {
      console.log('🎯 Double-click detected - flipping card');
      setLocalIsFlipped(prev => !prev);
      onClick();
    },
    delay: 300
  });

  // Enhanced mouse down handler with smart click detection preparation
  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onMouseDown(e);
  }, [onMouseDown]);

  // Create a no-parameter version for CardContainer3D
  const handleCardClick = React.useCallback(() => {
    const wasClick = !physicsState || physicsState?.dragDistance < 5;
    
    if (wasClick) {
      console.log('🎯 Smart click detected - triggering double-click handler');
      handleDoubleClick();
    }
  }, [physicsState?.dragDistance, handleDoubleClick]);

  // Enhanced touch handlers for mobile support
  const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    // Convert touch to mouse event for compatibility
    const touch = e.touches[0];
    if (touch) {
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY,
        bubbles: true
      });
      onMouseDown(mouseEvent as any);
    }
  }, [onMouseDown]);

  const handleTouchMove = React.useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY,
        bubbles: true
      });
      onMouseMove(mouseEvent as any);
    }
  }, [onMouseMove]);

  const handleTouchEnd = React.useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    // Trigger mouse up equivalent
    const mouseEvent = new MouseEvent('mouseup', {
      bubbles: true
    });
    document.dispatchEvent(mouseEvent);
  }, []);

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
        height: `${containerHeight}px`,
        touchAction: 'none' // Prevent default touch behaviors
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleDoubleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
      
      {/* Enhanced Grip Feedback with improved touch support */}
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
      
      {/* Enhanced Physics Debug Info with sensitivity display */}
      {physicsState && isDragging && (
        <div className="absolute bottom-2 left-2 text-xs text-white/60 font-mono bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
          <div>Angular V: {Math.round(physicsState.angularVelocity?.x * 100) || 0}, {Math.round(physicsState.angularVelocity?.y * 100) || 0}</div>
          <div>Sensitivity: {((1 + totalEffectIntensity * 0.4) * 3.2).toFixed(1)}x HIGH</div>
          <div>Drag: {Math.round(physicsState.dragDistance || 0)}px</div>
        </div>
      )}
      
      {/* Enhanced Velocity Indicator for Flick Gestures with higher threshold */}
      {physicsState?.angularVelocity && (Math.abs(physicsState.angularVelocity.x) > 2 || Math.abs(physicsState.angularVelocity.y) > 2) && (
        <div className="absolute top-2 left-2 z-40 pointer-events-none">
          <div className="w-3 h-3 bg-crd-primary rounded-full animate-pulse opacity-80">
            <div className="absolute inset-0 bg-crd-primary rounded-full animate-ping"></div>
          </div>
        </div>
      )}

      {/* Enhanced interaction hints */}
      {!isDragging && isHovering && (
        <div className="absolute bottom-2 right-2 text-xs text-white/40 font-mono bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
          Double-click to flip • Drag/Swipe to rotate • High sensitivity enabled
        </div>
      )}
    </div>
  );
};
