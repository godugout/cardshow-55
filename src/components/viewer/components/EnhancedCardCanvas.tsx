
import React, { useRef, useEffect, useState } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { EnhancedCardContainer } from './EnhancedCardContainer';
import { useDoubleClick } from '@/hooks/useDoubleClick';
import { useThrottledMousePosition } from '../hooks/useThrottledMousePosition';

interface EnhancedCardCanvasProps {
  card: CardData;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  rotation: { x: number; y: number };
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  overallBrightness: number;
  interactiveLighting: boolean;
  materialSettings: MaterialSettings;
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onCardFlip?: () => void;
  width?: number;
  height?: number;
}

export const EnhancedCardCanvas: React.FC<EnhancedCardCanvasProps> = ({
  card,
  effectValues,
  mousePosition,
  isHovering,
  rotation,
  selectedScene,
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  materialSettings,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onCardFlip,
  width = 400,
  height = 560
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Use throttled mouse position for smoother performance
  const { mousePosition: throttledMousePosition, updateMousePosition } = useThrottledMousePosition(16);

  console.log('EnhancedCardCanvas rendering with flip handler:', !!onCardFlip);

  // Handle card flip on double-click/tap - use parent's flip handler
  const handleDoubleClick = useDoubleClick({
    onDoubleClick: () => {
      console.log('🎯 Double-click detected - calling parent flip handler');
      if (onCardFlip) {
        onCardFlip();
      }
    },
    delay: 300
  });

  // Handle mouse move with throttling
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    onMouseMove(event);
    
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      updateMousePosition(x, y);
    }
  };

  // Use the provided mouse position for immediate updates, throttled for internal calculations
  const effectiveMousePosition = interactiveLighting ? throttledMousePosition : mousePosition;

  // Enhanced frame styles with better vibrancy
  const frameStyles: React.CSSProperties = React.useMemo(() => ({
    background: `linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)`,
    border: '1px solid rgba(255,255,255,0.15)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
  }), []);

  // Enhanced effect styles with increased vibrancy
  const enhancedEffectStyles: React.CSSProperties = React.useMemo(() => ({
    filter: `brightness(${Math.max(100, overallBrightness) / 100}) contrast(1.15) saturate(1.2)`,
    transition: 'filter 0.3s ease'
  }), [overallBrightness]);

  // Enhanced surface texture component
  const SurfaceTexture = React.useMemo(() => (
    <div 
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        mixBlendMode: 'overlay'
      }}
    />
  ), []);

  return (
    <div
      ref={canvasRef}
      className="relative flex items-center justify-center"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        perspective: '1000px'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleDoubleClick}
    >
      {/* CRD Logo Branding - Upper Right */}
      <div className="absolute top-4 right-4 z-50">
        <img 
          src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
          alt="CRD Logo" 
          className="w-16 h-auto opacity-60 hover:opacity-80 transition-opacity duration-200"
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
          }}
          onLoad={() => console.log('Canvas CRD branding logo loaded successfully')}
          onError={() => console.log('Error loading Canvas CRD branding logo')}
        />
      </div>

      {/* Enhanced Card Container - Remove internal flip state */}
      <EnhancedCardContainer
        card={card}
        isFlipped={false} // Let parent handle flip state
        isHovering={isHovering}
        showEffects={true}
        effectValues={effectValues}
        mousePosition={effectiveMousePosition}
        rotation={rotation}
        zoom={1}
        isDragging={isDragging}
        frameStyles={frameStyles}
        enhancedEffectStyles={enhancedEffectStyles}
        SurfaceTexture={SurfaceTexture}
        interactiveLighting={interactiveLighting}
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        materialSettings={materialSettings}
        overallBrightness={[overallBrightness]}
        showBackgroundInfo={true}
        onMouseDown={() => setIsDragging(true)}
        onMouseMove={handleMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={() => {
          setIsDragging(false);
          onMouseLeave();
        }}
        onClick={handleDoubleClick}
      />

      {/* Enhanced interaction hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm">
        Double-click to flip card
      </div>
    </div>
  );
};

EnhancedCardCanvas.displayName = 'EnhancedCardCanvas';
