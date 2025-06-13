
import React, { useRef, useState } from 'react';
import { EnhancedCardContainer } from './EnhancedCardContainer';
import { CardNavigationHandler } from './CardNavigationHandler';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface ViewerCardDisplayProps {
  card: CardData;
  cards: any[];
  currentCardIndex: number;
  onCardChange?: (index: number) => void;
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
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export const ViewerCardDisplay: React.FC<ViewerCardDisplayProps> = ({
  card,
  cards,
  currentCardIndex,
  onCardChange,
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
  selectedLighting,
  materialSettings,
  overallBrightness,
  onMouseDown,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick
}) => {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // Add environment controls state
  const [environmentControls] = useState({
    depthOfField: 1.0,
    parallaxIntensity: 1.0,
    fieldOfView: 75,
    atmosphericDensity: 1.0
  });

  // Handle card click for flipping
  const handleCardClick = () => {
    setIsFlipped(prev => !prev);
    onClick();
  };

  // Handle double click for flipping
  const handleDoubleClick = () => {
    setIsFlipped(prev => !prev);
  };

  return (
    <>
      {/* Card Navigation Controls */}
      <CardNavigationHandler
        cards={cards}
        currentCardIndex={currentCardIndex}
        onCardChange={onCardChange}
        setIsFlipped={setIsFlipped}
      />

      {/* Enhanced Card Container with proper event handling */}
      <div 
        ref={cardContainerRef} 
        className="relative z-20 pointer-events-none"
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="pointer-events-auto"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={handleCardClick}
          onDoubleClick={handleDoubleClick}
          style={{ pointerEvents: 'auto' }}
        >
          <EnhancedCardContainer
            card={card}
            isHovering={isHovering}
            showEffects={showEffects}
            effectValues={effectValues}
            mousePosition={mousePosition}
            rotation={rotation}
            zoom={zoom}
            isDragging={isDragging}
            frameStyles={frameStyles}
            enhancedEffectStyles={enhancedEffectStyles}
            SurfaceTexture={SurfaceTexture}
            interactiveLighting={interactiveLighting}
            selectedScene={selectedScene}
            selectedLighting={selectedLighting}
            materialSettings={materialSettings}
            overallBrightness={overallBrightness}
            environmentControls={environmentControls}
            showBackgroundInfo={false}
            onMouseDown={() => {}} // Remove duplicate handlers
            onMouseMove={() => {}} // Remove duplicate handlers
            onMouseEnter={() => {}} // Remove duplicate handlers
            onMouseLeave={() => {}} // Remove duplicate handlers
            onClick={() => {}} // Remove duplicate handlers
          />
        </div>
      </div>
    </>
  );
};
