
import React, { useRef, useEffect } from 'react';
import { EnhancedCardContainer } from '../EnhancedCardContainer';
import type { SpaceCard, SpaceTemplate } from '../../types/spaces';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../../types';

interface SpaceCanvasProps {
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

export const SpaceCanvas: React.FC<SpaceCanvasProps> = ({
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
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  // Generate frame styles based on template environment
  const getFrameStyles = () => ({
    background: template?.environment.background || 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
    border: '1px solid rgba(255,255,255,0.1)'
  });

  // Generate enhanced effect styles
  const getEnhancedEffectStyles = () => ({
    filter: `brightness(${overallBrightness[0] / 100}) contrast(1.1)`
  });

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
      className="relative w-full h-80 overflow-hidden rounded-lg border border-white/10"
      style={{
        background: template?.environment.background || 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        perspective: '1000px'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Environment fog effect */}
      {template?.environment.fog && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, transparent 40%, ${template.environment.fog.color}80 100%)`,
            opacity: 0.6
          }}
        />
      )}

      {/* Empty state */}
      {spaceCards.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            {template ? (
              <>
                <div className="text-4xl mb-2">{template.emoji}</div>
                <div className="text-sm">Add cards to your {template.name}</div>
                <div className="text-xs mt-1">Drag cards from your collection or use the + button</div>
              </>
            ) : (
              <>
                <div className="text-2xl mb-2">🌌</div>
                <div className="text-sm">Select a space template to begin</div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Space cards */}
      {spaceCards.map((spaceCard, index) => {
        // Calculate 3D transform for card positioning
        const transform = `
          translate3d(${spaceCard.position.x * 60}px, ${-spaceCard.position.y * 60}px, ${spaceCard.position.z * 60}px)
          rotateX(${spaceCard.rotation.x}deg)
          rotateY(${spaceCard.rotation.y}deg)
          rotateZ(${spaceCard.rotation.z}deg)
          scale(${spaceCard.scale * 0.4})
        `;

        return (
          <div
            key={spaceCard.id}
            className={`absolute top-1/2 left-1/2 transition-all duration-300 ${
              spaceCard.isSelected ? 'ring-2 ring-crd-green' : ''
            } ${isEditMode ? 'cursor-pointer hover:scale-110' : ''}`}
            style={{
              transform,
              transformStyle: 'preserve-3d',
              zIndex: 10 + index,
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (isEditMode) {
                onCardSelect(spaceCard.id, e.ctrlKey || e.metaKey);
              }
            }}
          >
            <div style={{ transform: 'scale(0.6)' }}>
              <EnhancedCardContainer
                card={spaceCard.card}
                isFlipped={false}
                isHovering={isHovering}
                showEffects={true}
                effectValues={effectValues}
                mousePosition={mousePosition}
                rotation={{ x: 0, y: 0 }}
                zoom={1}
                isDragging={false}
                frameStyles={getFrameStyles()}
                enhancedEffectStyles={getEnhancedEffectStyles()}
                SurfaceTexture={SurfaceTexture}
                interactiveLighting={interactiveLighting}
                selectedScene={selectedScene}
                selectedLighting={selectedLighting}
                materialSettings={materialSettings}
                overallBrightness={overallBrightness}
                showBackgroundInfo={false}
                onMouseDown={() => {}}
                onMouseMove={() => {}}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                onClick={() => {}}
              />
            </div>
            
            {/* Selection indicator */}
            {spaceCard.isSelected && (
              <div className="absolute -inset-2 border-2 border-crd-green rounded-lg bg-crd-green/10 pointer-events-none animate-pulse" />
            )}
          </div>
        );
      })}

      {/* Edit mode overlay */}
      {isEditMode && (
        <div className="absolute top-2 right-2 bg-crd-green/20 text-crd-green px-2 py-1 rounded text-xs font-medium">
          Edit Mode
        </div>
      )}
    </div>
  );
};
