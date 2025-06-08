
import React, { useRef, useState } from 'react';
import { SpaceEnvironmentLayer } from './SpaceEnvironmentLayer';
import { SpaceEmptyState } from './SpaceEmptyState';
import { SpaceEditModeOverlay } from './SpaceEditModeOverlay';
import { SpaceCardRenderer } from './SpaceCardRenderer';
import type { SpaceCard, SpaceTemplate } from '../../types/spaces';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../../types';

interface Enhanced3DSpaceCanvasProps {
  spaceCards: SpaceCard[];
  template: SpaceTemplate | null;
  effectValues: EffectValues;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  overallBrightness: number[];
  interactiveLighting: boolean;
  isEditMode: boolean;
  onCardSelect: (cardId: string, multiSelect: boolean) => void;
  onCardPositionChange: (cardId: string, position: { x: number; y: number; z: number }) => void;
}

export const Enhanced3DSpaceCanvas: React.FC<Enhanced3DSpaceCanvasProps> = ({
  spaceCards,
  template,
  effectValues,
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness,
  interactiveLighting,
  isEditMode,
  onCardSelect,
  onCardPositionChange
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  // Enhanced 3D perspective and styling
  const canvasStyle = {
    perspective: '1500px', // Increased perspective for better 3D effect
    transformStyle: 'preserve-3d' as const,
    background: template?.environment.background || 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)',
    overflow: 'hidden'
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full min-h-[800px] rounded-lg border border-white/10"
      style={canvasStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Enhanced Environment Layer - fills entire canvas with proper 3D background */}
      <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        <SpaceEnvironmentLayer template={template} />
      </div>

      {/* Empty State */}
      {spaceCards.length === 0 && (
        <SpaceEmptyState template={template} />
      )}

      {/* 3D Space Container with proper perspective */}
      {template && spaceCards.length > 0 && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            transform: `
              perspective(1500px) 
              rotateX(${template.category === 'gallery' ? '0deg' : '5deg'}) 
              rotateY(0deg)
            `
          }}
        >
          {/* Enhanced space cards with proper positioning */}
          {spaceCards.map((spaceCard, index) => (
            <SpaceCardRenderer
              key={spaceCard.id}
              spaceCard={spaceCard}
              index={index}
              template={template}
              isHovering={isHovering}
              isEditMode={isEditMode}
              effectValues={effectValues}
              mousePosition={mousePosition}
              selectedScene={selectedScene}
              selectedLighting={selectedLighting}
              materialSettings={materialSettings}
              overallBrightness={overallBrightness}
              interactiveLighting={interactiveLighting}
              onCardSelect={onCardSelect}
            />
          ))}
        </div>
      )}

      {/* Edit Mode Overlay */}
      <SpaceEditModeOverlay isEditMode={isEditMode} />

      {/* Enhanced 3D Scene Info */}
      {template && spaceCards.length > 0 && (
        <div className="absolute bottom-4 left-4 text-xs text-white/60 bg-black/30 px-3 py-2 rounded-lg backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <span>{template.emoji}</span>
            <span>{template.name}</span>
            <span>•</span>
            <span>{spaceCards.length}/{template.maxCards} cards</span>
          </div>
        </div>
      )}

      {/* Interaction hints */}
      {!isEditMode && spaceCards.length > 0 && (
        <div className="absolute bottom-4 right-4 text-xs text-white/60 bg-black/30 px-3 py-2 rounded-lg backdrop-blur-sm">
          Click cards to flip • Mouse to look around
        </div>
      )}
    </div>
  );
};
