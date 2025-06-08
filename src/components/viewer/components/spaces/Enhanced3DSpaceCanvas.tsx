
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

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full min-h-[600px] overflow-hidden rounded-lg border border-white/10"
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        background: template?.environment.background || 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Environment Layer - now fills entire canvas */}
      <SpaceEnvironmentLayer template={template} />

      {/* Empty State */}
      {spaceCards.length === 0 && (
        <SpaceEmptyState template={template} />
      )}

      {/* Enhanced space cards with corrected transforms */}
      {template && spaceCards.map((spaceCard, index) => (
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

      {/* Edit Mode Overlay */}
      <SpaceEditModeOverlay isEditMode={isEditMode} />

      {/* 3D Scene Depth Indicators */}
      {template && spaceCards.length > 0 && (
        <div className="absolute bottom-4 left-4 text-xs text-white/60">
          {template.name} • {spaceCards.length}/{template.maxCards} cards
        </div>
      )}
    </div>
  );
};
