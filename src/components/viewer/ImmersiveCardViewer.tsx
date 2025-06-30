
import React, { useState, useCallback } from 'react';
import { EnhancedCardCanvas } from './components/EnhancedCardCanvas';
import { CustomizePanel } from './components/CustomizePanel';
import type { CardData } from '@/types/card';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from './types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from './constants';

interface ImmersiveCardViewerProps {
  card: any;
  cards?: any[];
  currentCardIndex?: number;
  onCardChange?: (index: number) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onShare?: (card: any) => void;
  onDownload?: (card: any) => void;
  allowRotation?: boolean;
  showStats?: boolean;
  ambient?: boolean;
  // Studio panel integration props
  selectedScene?: EnvironmentScene;
  selectedLighting?: LightingPreset;
  materialSettings?: MaterialSettings;
  overallBrightness?: number[];
  interactiveLighting?: boolean;
  onSceneChange?: (scene: EnvironmentScene) => void;
  onLightingChange?: (lighting: LightingPreset) => void;
  onMaterialSettingsChange?: (settings: MaterialSettings) => void;
  onBrightnessChange?: (value: number[]) => void;
  onInteractiveLightingToggle?: () => void;
}

export const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  cards = [],
  currentCardIndex = 0,
  onCardChange,
  isOpen = true,
  onClose,
  onShare,
  onDownload,
  allowRotation = true,
  showStats = true,
  ambient = true,
  // Studio panel props
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness = [100],
  interactiveLighting = true,
  onSceneChange,
  onLightingChange,
  onMaterialSettingsChange,
  onBrightnessChange,
  onInteractiveLightingToggle
}) => {
  const [showCustomizePanel, setShowCustomizePanel] = useState(true);
  const [selectedEffect, setSelectedEffect] = useState({
    id: 'none',
    name: 'None',
    description: 'No visual effects applied',
    category: 'surface' as const
  });
  const [effectIntensity, setEffectIntensity] = useState([50]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });

    if (allowRotation) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const deltaX = (mouseX - centerX) / centerX;
      const deltaY = (mouseY - centerY) / centerY;

      setRotation({
        x: deltaY * 10,
        y: deltaX * 15,
      });
    }
  }, [allowRotation]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  const handleInteractiveLightingToggle = useCallback(() => {
    if (onInteractiveLightingToggle) {
      onInteractiveLightingToggle();
    }
  }, [onInteractiveLightingToggle]);

  const handleCardNavigation = (indexChange: number) => {
    if (onCardChange) {
      const newIndex = (currentCardIndex + indexChange + cards.length) % cards.length;
      onCardChange(newIndex);
    }
  };

  // Extract enhanced effects from card design metadata
  const enhancedEffects = card?.design_metadata?.enhanced_effects || {};
  const studioSettings = card?.design_metadata?.studio_settings || {};

  console.log('🎬 ImmersiveCardViewer: Enhanced effects from Studio:', enhancedEffects);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl overflow-hidden">
      {/* Enhanced 3D Scene with Studio Effects */}
      <div className="relative w-full h-full">
        {/* Main Canvas */}
        <EnhancedCardCanvas
          card={card}
          effectValues={enhancedEffects} // Use Studio panel effects
          mousePosition={mousePosition}
          isHovering={isHovering}
          rotation={rotation}
          selectedScene={selectedScene || studioSettings.selectedScene || ENVIRONMENT_SCENES[0]}
          selectedLighting={selectedLighting || studioSettings.selectedLighting || LIGHTING_PRESETS[0]}
          overallBrightness={overallBrightness[0]}
          interactiveLighting={interactiveLighting}
          materialSettings={materialSettings || studioSettings.materialSettings || {
            metalness: 0.5,
            roughness: 0.5,
            reflectivity: 0.5,
            clearcoat: 0.3
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          width={500}
          height={700}
        />

        {/* UI Controls */}
        <div className="absolute top-4 left-4 z-50 flex items-center space-x-2">
          <button
            onClick={() => handleCardNavigation(-1)}
            className="bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-colors"
          >
            ←
          </button>
          <span className="text-white text-sm">
            {currentCardIndex + 1} / {cards.length}
          </span>
          <button
            onClick={() => handleCardNavigation(1)}
            className="bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-colors"
          >
            →
          </button>
        </div>

        {/* Customize Panel Toggle */}
        <button
          onClick={() => setShowCustomizePanel(!showCustomizePanel)}
          className="absolute top-4 right-4 z-50 bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-colors"
        >
          {showCustomizePanel ? 'Hide Settings' : 'Show Settings'}
        </button>

        {/* Enhanced Customize Panel with Studio Integration */}
        {showCustomizePanel && (
          <CustomizePanel
            selectedScene={selectedScene || studioSettings.selectedScene || ENVIRONMENT_SCENES[0]}
            selectedLighting={selectedLighting || studioSettings.selectedLighting || LIGHTING_PRESETS[0]}
            selectedEffect={selectedEffect}
            effectIntensity={effectIntensity}
            overallBrightness={overallBrightness}
            interactiveLighting={interactiveLighting}
            materialSettings={materialSettings || studioSettings.materialSettings || {
              metalness: 0.5,
              roughness: 0.5,
              reflectivity: 0.5,
              clearcoat: 0.3
            }}
            isFullscreen={isFullscreen}
            onSceneChange={onSceneChange}
            onLightingChange={onLightingChange}
            onEffectChange={setSelectedEffect}
            onEffectIntensityChange={setEffectIntensity}
            onBrightnessChange={onBrightnessChange}
            onInteractiveLightingToggle={handleInteractiveLightingToggle}
            onMaterialSettingsChange={onMaterialSettingsChange}
            onToggleFullscreen={handleToggleFullscreen}
            onDownload={onDownload}
            onShare={onShare}
            onClose={() => setShowCustomizePanel(false)}
            card={card}
          />
        )}

        {/* Background Info Panel */}
        {showStats && (
          <div className="absolute bottom-4 left-4 z-50">
            {/* Implement BackgroundInfo component here */}
          </div>
        )}
      </div>
    </div>
  );
};
