
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { CardContainer3D } from './CardContainer3D';
import { GripFeedback } from './GripFeedback';
import { RotationIndicator } from './RotationIndicator';
import { ARBackgroundLayer } from './ARBackgroundLayer';
import { ARDepthField } from './ARDepthField';
import { useAREffects } from '../hooks/useAREffects';

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

  // Calculate total effect intensity for AR calculations
  const totalEffectIntensity = React.useMemo(() => {
    if (!effectValues) return 0;
    return Object.values(effectValues).reduce((total, effect) => {
      const intensity = effect.intensity as number;
      return total + (typeof intensity === 'number' ? intensity : 0);
    }, 0);
  }, [effectValues]);

  // Use AR effects hook
  const arEffects = useAREffects({
    zoom,
    rotation,
    isHovering,
    isDragging,
    effectIntensity: totalEffectIntensity
  });

  console.log('🎯 SimplifiedEnhancedCardContainer rendering with AR effects:', {
    cardTitle: card.title,
    isARMode: arEffects.isARMode,
    dynamicZIndex: arEffects.dynamicZIndex,
    arIntensity: arEffects.arIntensity,
    zoom,
    rotation
  });

  const containerWidth = 400;
  const containerHeight = 560;

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
    <ARBackgroundLayer
      isARMode={arEffects.isARMode}
      backgroundBlur={arEffects.backgroundBlur}
      parallaxOffset={arEffects.parallaxOffset}
      arIntensity={arEffects.arIntensity}
    >
      {/* AR Depth Field */}
      <ARDepthField
        isARMode={arEffects.isARMode}
        arIntensity={arEffects.arIntensity}
        cardPosition={mousePosition}
      />
      
      <div 
        className={`relative select-none ${getCursorStyle()}`}
        style={{
          ...arEffects.enhancedTransform,
          ...arEffects.enhancedShadow,
          ...arEffects.glowEffect,
          transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: arEffects.dynamicZIndex,
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
          willChange: 'transform, filter, box-shadow, z-index'
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
        
        {/* Enhanced Grip Feedback with AR awareness */}
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
        
        {/* Enhanced AR Physics Debug Info */}
        {physicsState && isDragging && (
          <div className="absolute bottom-2 left-2 text-xs text-white/60 font-mono bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
            <div>AR Mode: {arEffects.isARMode ? 'ON' : 'OFF'}</div>
            <div>Z-Index: {arEffects.dynamicZIndex}</div>
            <div>AR Intensity: {Math.round(arEffects.arIntensity * 100)}%</div>
            <div>Drag: {Math.round(physicsState.dragDistance || 0)}px</div>
          </div>
        )}
        
        {/* Enhanced Velocity Indicator for Flick Gestures with AR glow */}
        {physicsState?.angularVelocity && (Math.abs(physicsState.angularVelocity.x) > 3 || Math.abs(physicsState.angularVelocity.y) > 3) && (
          <div className="absolute top-2 left-2 z-40 pointer-events-none">
            <div 
              className="w-3 h-3 bg-crd-primary rounded-full animate-pulse opacity-80"
              style={{
                boxShadow: arEffects.isARMode ? 
                  `0 0 ${10 + arEffects.arIntensity * 20}px rgba(0, 200, 81, 0.6)` : 
                  'none'
              }}
            >
              <div className="absolute inset-0 bg-crd-primary rounded-full animate-ping"></div>
            </div>
          </div>
        )}

        {/* Smart Click Indicator with AR styling */}
        {!isDragging && isHovering && (
          <div 
            className="absolute bottom-2 right-2 text-xs text-white/40 font-mono px-2 py-1 rounded backdrop-blur-sm transition-all duration-300"
            style={{
              backgroundColor: arEffects.isARMode ? 
                `rgba(0, 0, 0, ${0.3 + arEffects.arIntensity * 0.2})` : 
                'rgba(0, 0, 0, 0.2)',
              border: arEffects.isARMode ? 
                `1px solid rgba(0, 200, 81, ${arEffects.arIntensity * 0.3})` : 
                'none'
            }}
          >
            Click to flip • Drag to rotate
            {arEffects.isARMode && <span className="ml-2 text-crd-primary">🥽 AR</span>}
          </div>
        )}
      </div>
    </ARBackgroundLayer>
  );
};
