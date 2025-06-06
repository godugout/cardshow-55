import React, { useRef, useEffect, useState } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { EnhancedCardContainer } from './EnhancedCardContainer';
import { useDoubleClick } from '@/hooks/useDoubleClick';

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
  width = 400,
  height = 560
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  console.log('EnhancedCardCanvas rendering, isFlipped:', isFlipped);

  // Handle card flip on double-click/tap
  const handleDoubleClick = useDoubleClick({
    onDoubleClick: () => {
      setIsFlipped(!isFlipped);
      console.log('Card flipped to:', !isFlipped);
    },
    delay: 300
  });

  // Mock frame styles for the container
  const frameStyles: React.CSSProperties = {
    background: `linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)`,
    border: '1px solid rgba(255,255,255,0.1)'
  };

  // Mock enhanced effect styles
  const enhancedEffectStyles: React.CSSProperties = {
    filter: `brightness(${overallBrightness / 100}) contrast(1.1)`
  };

  // Simple surface texture component
  const SurfaceTexture = (
    <div 
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
    />
  );

  return (
    <div
      ref={canvasRef}
      className="relative flex items-center justify-center"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        perspective: '1000px'
      }}
      onMouseMove={onMouseMove}
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

      {/* Enhanced Card Container with 3D Background Info */}
      <EnhancedCardContainer
        card={card}
        isFlipped={isFlipped}
        isHovering={isHovering}
        showEffects={true}
        effectValues={effectValues}
        mousePosition={mousePosition}
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
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={() => {
          setIsDragging(false);
          onMouseLeave();
        }}
        onClick={handleDoubleClick}
      />

      {/* Click instruction updated */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm">
        Double-click to flip card
      </div>
    </div>
  );
};
