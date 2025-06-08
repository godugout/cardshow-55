
import React, { useState } from 'react';
import { LightingSection } from '../../LightingSection';
import { BackgroundsSection } from '../sections/BackgroundsSection';
import { filterLightingPresetsForBackground } from '../utils/lightingFilters';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../../../types';
import type { EffectValues } from '../../../hooks/useEnhancedCardEffects';
import type { CardData } from '@/hooks/useCardEditor';

interface SpacesTabProps {
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  overallBrightness: number[];
  interactiveLighting: boolean;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
  effectValues: EffectValues;
  materialSettings: MaterialSettings;
  currentCard?: CardData;
}

export const SpacesTab: React.FC<SpacesTabProps> = ({
  selectedScene,
  selectedLighting,
  overallBrightness,
  interactiveLighting,
  onSceneChange,
  onLightingChange,
  onBrightnessChange,
  onInteractiveLightingToggle,
  effectValues,
  materialSettings,
  currentCard
}) => {
  const [selectedBackgroundType, setSelectedBackgroundType] = useState<'env' | 'wallpaper'>('env');
  const [selectedWallpaper, setSelectedWallpaper] = useState<string | null>(null);

  // Filter lighting presets based on selected background
  const filteredLightingPresets = filterLightingPresetsForBackground(
    selectedBackgroundType,
    selectedBackgroundType === 'env' ? selectedScene : selectedWallpaper
  );

  return (
    <div className="space-y-6">
      {/* Backgrounds Section */}
      <div>
        <h3 className="text-white font-medium text-lg mb-4 flex items-center">
          🖼️ Backgrounds
        </h3>
        <BackgroundsSection
          selectedBackgroundType={selectedBackgroundType}
          selectedScene={selectedScene}
          selectedWallpaper={selectedWallpaper}
          onBackgroundTypeChange={setSelectedBackgroundType}
          onSceneChange={onSceneChange}
          onWallpaperChange={setSelectedWallpaper}
          effectValues={effectValues}
          materialSettings={materialSettings}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          currentCard={currentCard}
        />
      </div>

      {/* Lighting Section - Context-aware */}
      <div>
        <h3 className="text-white font-medium text-lg mb-4 flex items-center">
          💡 Lighting
        </h3>
        <div className="mb-3">
          <p className="text-sm text-gray-400">
            {selectedBackgroundType === 'env' 
              ? `Optimized for ${selectedScene} environment`
              : `Optimized for wallpaper backgrounds`
            }
          </p>
        </div>
        <LightingSection
          selectedLighting={selectedLighting}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          onLightingChange={onLightingChange}
          onBrightnessChange={onBrightnessChange}
          onInteractiveLightingToggle={onInteractiveLightingToggle}
          filteredPresets={filteredLightingPresets}
        />
      </div>
    </div>
  );
};
