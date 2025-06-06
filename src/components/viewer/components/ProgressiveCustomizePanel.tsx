
import React, { useCallback, useState, useMemo } from 'react';
import { Sparkles, X, Download, Share2, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CollapsibleSection } from '@/components/ui/design-system';
import { EnhancedQuickComboPresets } from './EnhancedQuickComboPresets';
import { EnhancedEffectsList } from './EnhancedEffectsList';
import { EnvironmentSection } from './EnvironmentSection';
import { MaterialPropertiesSection } from './MaterialPropertiesSection';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface ProgressiveCustomizePanelProps {
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  effectValues: EffectValues;
  overallBrightness: number[];
  interactiveLighting: boolean;
  materialSettings: MaterialSettings;
  isFullscreen: boolean;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onResetAllEffects: () => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
  onToggleFullscreen: () => void;
  onDownload: () => void;
  onShare?: () => void;
  onClose: () => void;
  card: any;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  onApplyCombo: (combo: any) => void;
  isApplyingPreset?: boolean;
}

export const ProgressiveCustomizePanel: React.FC<ProgressiveCustomizePanelProps> = ({
  selectedScene,
  selectedLighting,
  effectValues,
  overallBrightness,
  interactiveLighting,
  materialSettings,
  isFullscreen,
  onSceneChange,
  onLightingChange,
  onEffectChange,
  onResetAllEffects,
  onBrightnessChange,
  onInteractiveLightingToggle,
  onMaterialSettingsChange,
  onToggleFullscreen,
  onDownload,
  onShare,
  onClose,
  card,
  selectedPresetId,
  onPresetSelect,
  onApplyCombo,
  isApplyingPreset = false
}) => {
  // Section state management with smart defaults
  const [sectionStates, setSectionStates] = useState(() => {
    const stored = localStorage.getItem('studio-panel-sections');
    const defaults = {
      quickStyles: true, // Always open by default
      effects: false,
      environment: false,
      materials: false
    };
    return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
  });

  // Calculate active effects count
  const activeEffectsCount = useMemo(() => {
    return Object.values(effectValues).filter(effect => {
      const intensity = effect.intensity;
      return typeof intensity === 'number' && intensity > 0;
    }).length;
  }, [effectValues]);

  // Auto-expand effects section when user has active effects
  React.useEffect(() => {
    if (activeEffectsCount > 0 && !sectionStates.effects) {
      setSectionStates(prev => ({ ...prev, effects: true }));
    }
  }, [activeEffectsCount, sectionStates.effects]);

  // Handle section toggle with persistence
  const handleSectionToggle = useCallback((section: string, isOpen: boolean) => {
    const newStates = { ...sectionStates, [section]: isOpen };
    setSectionStates(newStates);
    localStorage.setItem('studio-panel-sections', JSON.stringify(newStates));
  }, [sectionStates]);

  const handleBrightnessChange = useCallback(
    (value: number[]) => {
      onBrightnessChange(value);
    },
    [onBrightnessChange],
  );

  return (
    <div className="h-full bg-black bg-opacity-95 backdrop-blur-lg border-l border-white/10 flex flex-col w-80 sm:w-96 lg:w-[22rem] xl:w-[26rem] 2xl:w-[28rem] max-w-[20vw]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white">🎨 Studio</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5 text-white" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Quick Styles Section - Always Open */}
          <CollapsibleSection
            title="Styles"
            emoji="🎨"
            statusText={isApplyingPreset ? "Applying..." : undefined}
            alwaysOpen={true}
          >
            <EnhancedQuickComboPresets
              onApplyCombo={onApplyCombo}
              currentEffects={effectValues}
              selectedPresetId={selectedPresetId}
              onPresetSelect={onPresetSelect}
              isApplyingPreset={isApplyingPreset}
            />
          </CollapsibleSection>

          {/* Effects Section - Collapsible */}
          <CollapsibleSection
            title="Effects"
            emoji="✨"
            statusCount={activeEffectsCount}
            isOpen={sectionStates.effects}
            onToggle={(isOpen) => handleSectionToggle('effects', isOpen)}
          >
            <EnhancedEffectsList
              effectValues={effectValues}
              onEffectChange={onEffectChange}
              selectedPresetId={selectedPresetId}
            />
          </CollapsibleSection>

          {/* Environment Section - Collapsible */}
          <CollapsibleSection
            title="Scene"
            emoji="🌍"
            statusText={`${selectedScene.name} • ${selectedLighting.name}`}
            isOpen={sectionStates.environment}
            onToggle={(isOpen) => handleSectionToggle('environment', isOpen)}
          >
            <EnvironmentSection
              selectedScene={selectedScene}
              selectedLighting={selectedLighting}
              overallBrightness={overallBrightness}
              interactiveLighting={interactiveLighting}
              onSceneChange={onSceneChange}
              onLightingChange={onLightingChange}
              onBrightnessChange={handleBrightnessChange}
              onInteractiveLightingToggle={onInteractiveLightingToggle}
            />
          </CollapsibleSection>

          {/* Material Properties Section - Collapsible */}
          <CollapsibleSection
            title="Surface"
            emoji="💎"
            statusText="Custom Settings"
            isOpen={sectionStates.materials}
            onToggle={(isOpen) => handleSectionToggle('materials', isOpen)}
          >
            <MaterialPropertiesSection
              materialSettings={materialSettings}
              onMaterialSettingsChange={onMaterialSettingsChange}
            />
          </CollapsibleSection>
        </div>
      </div>

      {/* Fixed Export Section at Bottom */}
      <div className="border-t border-white/10 p-4 bg-black/50">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFullscreen}
            className="flex-1 border-white/20 text-white hover:bg-white/10"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
            🔲 View
          </Button>
          
          {onShare && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
              className="flex-1 border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
            >
              <Share2 className="w-4 h-4 mr-2" />
              📤 Share
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            className="flex-1 border-crd-green/50 text-crd-green hover:bg-crd-green/10"
          >
            <Download className="w-4 h-4 mr-2" />
            💾 Save
          </Button>
        </div>
      </div>
    </div>
  );
};
