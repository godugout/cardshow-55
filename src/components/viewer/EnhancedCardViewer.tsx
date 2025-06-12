
import React, { useState, useCallback, useEffect } from 'react';
import { useEnhancedCardEffects } from './hooks/useEnhancedCardEffects';
import { useEnhancedCardInteraction } from './hooks/useEnhancedCardInteraction';
import { EnhancedCardCanvas } from './components/EnhancedCardCanvas';
import { createStarlightPreset } from './hooks/effects/effectUtils';
import type { CardData } from '@/hooks/useCardEditor';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from './types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from './constants';

interface EnhancedCardViewerProps {
  card: CardData;
  onDownload?: (card: CardData) => void;
  onShare?: (card: CardData) => void;
  onClose?: () => void;
}

export const EnhancedCardViewer: React.FC<EnhancedCardViewerProps> = ({
  card,
  onDownload,
  onShare,
  onClose
}) => {
  // Debug logging to see if this viewer is being used
  console.log('EnhancedCardViewer rendering with card:', card?.title);

  // Card flip state - centralized here
  const [isFlipped, setIsFlipped] = useState(false);

  // Enhanced effects system with starlight defaults
  const {
    effectValues,
    handleEffectChange,
    resetEffect,
    resetAllEffects,
    applyPreset
  } = useEnhancedCardEffects();

  // Apply starlight preset on mount for immediate visual impact
  useEffect(() => {
    const starlightPreset = createStarlightPreset();
    applyPreset(starlightPreset, 'starlight-default');
    console.log('🌟 Applied starlight preset on mount:', starlightPreset);
  }, [applyPreset]);

  // Interactive card behavior
  const {
    mousePosition,
    isHovering,
    rotation,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave
  } = useEnhancedCardInteraction();

  // Environment and lighting state with enhanced vibrancy
  const [selectedScene, setSelectedScene] = useState<EnvironmentScene>(ENVIRONMENT_SCENES[0]);
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>(LIGHTING_PRESETS[0]);
  const [overallBrightness, setOverallBrightness] = useState(130); // Increased for starlight
  const [interactiveLighting, setInteractiveLighting] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Enhanced material properties for starlight vibrancy
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    metalness: 0.70, // Increased for better starlight reflection
    roughness: 0.25, // Decreased for more shine
    reflectivity: 0.85, // Increased for better sparkle
    clearcoat: 0.90 // Increased for maximum shine
  });

  // Card flip handler
  const handleCardFlip = useCallback(() => {
    console.log('🎯 Card flip requested, current state:', isFlipped);
    setIsFlipped(prev => {
      console.log('🎯 Flipping card from', prev, 'to', !prev);
      return !prev;
    });
  }, [isFlipped]);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  const handleInteractiveLightingToggle = useCallback(() => {
    setInteractiveLighting(!interactiveLighting);
  }, [interactiveLighting]);

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-screen'} bg-black overflow-hidden`}>
      {/* Main Canvas Area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <EnhancedCardCanvas
          card={card}
          effectValues={effectValues}
          mousePosition={mousePosition}
          isHovering={isHovering}
          rotation={rotation}
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          materialSettings={materialSettings}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onCardFlip={handleCardFlip}
          width={isFullscreen ? 500 : 400}
          height={isFullscreen ? 700 : 560}
        />
      </div>

      {/* Flip state indicator for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 z-50 bg-black bg-opacity-50 text-white p-2 rounded text-xs">
          Card Side: {isFlipped ? 'BACK (CRD Logo)' : 'FRONT (Image)'} | Starlight Active
        </div>
      )}

      {/* Close button - simple implementation */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-colors"
        >
          ×
        </button>
      )}
    </div>
  );
};
