
import React, { useRef, useEffect, useState } from 'react';
import { EnhancedCardContainer } from '../EnhancedCardContainer';
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

  // Enhanced environment rendering based on template
  const getEnvironmentStyle = () => {
    if (!template) return {};

    const baseStyle = {
      background: template.environment.background,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };

    // Add category-specific enhancements
    switch (template.category) {
      case 'gallery':
        return {
          ...baseStyle,
          background: `
            linear-gradient(180deg, rgba(26,26,26,0.8) 0%, rgba(45,45,45,0.9) 100%),
            radial-gradient(circle at 50% 20%, rgba(245,158,11,0.1) 0%, transparent 50%),
            ${template.environment.background}
          `,
          boxShadow: 'inset 0 0 100px rgba(245,158,11,0.05)'
        };
      case 'stadium':
        return {
          ...baseStyle,
          background: `
            radial-gradient(ellipse at center, rgba(15,20,25,0.7) 0%, rgba(26,37,47,0.9) 100%),
            linear-gradient(45deg, rgba(139,92,246,0.1) 0%, transparent 50%),
            ${template.environment.background}
          `,
          boxShadow: 'inset 0 0 150px rgba(139,92,246,0.1)'
        };
      case 'constellation':
        return {
          ...baseStyle,
          background: `
            radial-gradient(ellipse, rgba(10,10,35,0.9) 0%, rgba(0,0,0,1) 100%),
            radial-gradient(circle at 20% 30%, rgba(14,165,233,0.1) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(6,182,212,0.1) 0%, transparent 40%),
            ${template.environment.background}
          `,
          boxShadow: 'inset 0 0 200px rgba(14,165,233,0.1)'
        };
      case 'museum':
        return {
          ...baseStyle,
          background: `
            linear-gradient(180deg, rgba(245,245,245,0.95) 0%, rgba(224,224,224,0.98) 100%),
            radial-gradient(circle at 50% 0%, rgba(107,114,128,0.1) 0%, transparent 50%),
            ${template.environment.background}
          `,
          boxShadow: 'inset 0 20px 40px rgba(107,114,128,0.1)'
        };
      default:
        return baseStyle;
    }
  };

  // Generate frame styles
  const getFrameStyles = () => ({
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)'
  });

  // Generate enhanced effect styles
  const getEnhancedEffectStyles = () => ({
    filter: `brightness(${overallBrightness[0] / 100}) contrast(1.1)`,
    transition: 'all 0.3s ease'
  });

  // Surface texture component
  const SurfaceTexture = (
    <div 
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: template?.category === 'museum' 
          ? 'linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%)'
          : 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: template?.category === 'museum' ? '10px 10px' : '20px 20px'
      }}
    />
  );

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-80 overflow-hidden rounded-lg border border-white/10"
      style={{
        ...getEnvironmentStyle(),
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Enhanced environment effects */}
      {template?.environment.fog && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at center, transparent 30%, ${template.environment.fog.color}60 70%),
              radial-gradient(ellipse at 20% 80%, ${template.environment.fog.color}40 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, ${template.environment.fog.color}40 0%, transparent 50%)
            `,
            opacity: 0.8,
            mixBlendMode: 'multiply'
          }}
        />
      )}

      {/* Lighting effects based on template category */}
      {template && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: template.category === 'gallery' 
              ? `
                radial-gradient(circle at 50% 0%, rgba(245,158,11,0.2) 0%, transparent 40%),
                radial-gradient(circle at 25% 100%, rgba(245,158,11,0.1) 0%, transparent 30%),
                radial-gradient(circle at 75% 100%, rgba(245,158,11,0.1) 0%, transparent 30%)
              `
              : template.category === 'stadium'
              ? `
                radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 60%),
                linear-gradient(0deg, rgba(139,92,246,0.1) 0%, transparent 40%)
              `
              : template.category === 'constellation'
              ? `
                radial-gradient(circle at 30% 30%, rgba(14,165,233,0.1) 0%, transparent 20%),
                radial-gradient(circle at 70% 70%, rgba(6,182,212,0.1) 0%, transparent 20%),
                radial-gradient(circle at 50% 10%, rgba(168,85,247,0.05) 0%, transparent 30%)
              `
              : 'none',
            opacity: 0.7
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
                <div className="text-sm font-medium">{template.name}</div>
                <div className="text-xs mt-1 opacity-75">{template.description}</div>
                <div className="text-xs mt-2 text-crd-green">Click "Add Current" to place cards</div>
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

      {/* Enhanced space cards */}
      {spaceCards.map((spaceCard, index) => {
        // Enhanced 3D transform calculation
        const baseTransform = `
          translate3d(${spaceCard.position.x * 60}px, ${-spaceCard.position.y * 60}px, ${spaceCard.position.z * 40}px)
          rotateX(${spaceCard.rotation.x + (template?.category === 'constellation' ? Math.sin(Date.now() * 0.001 + index) * 2 : 0)}deg)
          rotateY(${spaceCard.rotation.y + (isHovering ? Math.sin(Date.now() * 0.002 + index) * 1 : 0)}deg)
          rotateZ(${spaceCard.rotation.z}deg)
          scale(${spaceCard.scale * 0.4})
        `;

        return (
          <div
            key={spaceCard.id}
            className={`absolute top-1/2 left-1/2 transition-all duration-300 ${
              spaceCard.isSelected ? 'ring-2 ring-crd-green ring-opacity-80' : ''
            } ${isEditMode ? 'cursor-pointer hover:scale-110' : ''}`}
            style={{
              transform: baseTransform,
              transformStyle: 'preserve-3d',
              zIndex: 10 + index + Math.floor(spaceCard.position.z * 5),
              filter: `drop-shadow(0 ${4 + spaceCard.position.z * 2}px ${8 + spaceCard.position.z * 4}px rgba(0,0,0,0.3))`
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
            
            {/* Enhanced selection indicator */}
            {spaceCard.isSelected && (
              <div className="absolute -inset-3 border-2 border-crd-green rounded-xl bg-crd-green/10 pointer-events-none">
                <div className="absolute inset-0 border border-crd-green/50 rounded-xl animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-crd-green rounded-full animate-pulse" />
              </div>
            )}
          </div>
        );
      })}

      {/* Edit mode overlay with enhanced styling */}
      {isEditMode && (
        <div className="absolute top-3 right-3 bg-crd-green/20 border border-crd-green/40 text-crd-green px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-crd-green rounded-full animate-pulse" />
            <span>Edit Mode</span>
          </div>
        </div>
      )}
    </div>
  );
};
