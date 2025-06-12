
import React, { useState, useCallback, useMemo } from 'react';
import { Sparkles, X, Palette, Lightbulb, Globe, Gem, Download } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { createProfessionalPresets, calculateStudioLighting } from '../hooks/effects/effectUtils';

interface OptimizedStudioPanelProps {
  isVisible: boolean;
  onClose: () => void;
  effectValues: EffectValues;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  overallBrightness: number[];
  interactiveLighting: boolean;
  mousePosition: { x: number; y: number };
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onPresetApply: (presetId: string) => void;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onMaterialChange: (settings: MaterialSettings) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
  onExport: () => void;
}

// Type for preset structure
interface PresetData {
  name: string;
  description: string;
  effects: EffectValues;
}

export const OptimizedStudioPanel: React.FC<OptimizedStudioPanelProps> = ({
  isVisible,
  onClose,
  effectValues,
  mousePosition,
  onEffectChange,
  onPresetApply,
  onExport
}) => {
  const [activeSection, setActiveSection] = useState<'presets' | 'effects' | 'lighting' | 'materials'>('presets');
  
  // Calculate current effect statistics
  const effectStats = useMemo(() => {
    const activeEffects = Object.entries(effectValues || {}).filter(([_, effect]) => 
      effect.intensity && typeof effect.intensity === 'number' && effect.intensity > 0
    );
    
    const totalIntensity = activeEffects.reduce((sum, [_, effect]) => 
      sum + (effect.intensity as number), 0
    );
    
    return {
      activeCount: activeEffects.length,
      totalIntensity: Math.round(totalIntensity),
      averageIntensity: activeEffects.length > 0 ? Math.round(totalIntensity / activeEffects.length) : 0
    };
  }, [effectValues]);

  // Professional presets with proper typing
  const presets = useMemo(() => createProfessionalPresets() as Record<string, PresetData>, []);

  // Studio lighting calculation
  const studioLighting = useMemo(() => 
    calculateStudioLighting(mousePosition), [mousePosition]
  );

  const handlePresetSelect = useCallback((presetId: string) => {
    onPresetApply(presetId);
  }, [onPresetApply]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-80 z-50 bg-black/95 backdrop-blur-lg border-l border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-crd-green" />
          <h2 className="text-lg font-semibold text-white">Studio</h2>
          <Badge variant="secondary" className="text-xs">
            {effectStats.activeCount} active
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4 text-white" />
        </Button>
      </div>

      {/* Studio Stats */}
      <div className="p-4 bg-white/5">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-white">{effectStats.activeCount}</div>
            <div className="text-xs text-white/60">Effects</div>
          </div>
          <div>
            <div className="text-lg font-bold text-crd-green">{effectStats.averageIntensity}%</div>
            <div className="text-xs text-white/60">Average</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">{Math.round(studioLighting.keyLight.intensity * 100)}%</div>
            <div className="text-xs text-white/60">Lighting</div>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex border-b border-white/10">
        {[
          { id: 'presets', icon: Palette, label: 'Presets' },
          { id: 'effects', icon: Sparkles, label: 'Effects' },
          { id: 'lighting', icon: Lightbulb, label: 'Lighting' },
          { id: 'materials', icon: Gem, label: 'Materials' }
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id as any)}
            className={`flex-1 flex flex-col items-center p-3 transition-colors ${
              activeSection === id 
                ? 'bg-crd-green/20 text-crd-green border-b-2 border-crd-green' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon className="w-4 h-4 mb-1" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {activeSection === 'presets' && (
            <div className="space-y-4">
              <h3 className="text-white font-medium mb-3">Professional Presets</h3>
              {Object.entries(presets).map(([id, preset]) => (
                <button
                  key={id}
                  onClick={() => handlePresetSelect(id)}
                  className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-left transition-all hover:scale-[1.02]"
                >
                  <div className="font-medium text-white mb-1">{preset.name}</div>
                  <div className="text-sm text-white/60 mb-2">{preset.description}</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.keys(preset.effects).map(effectId => (
                      <Badge key={effectId} variant="outline" className="text-xs">
                        {effectId}
                      </Badge>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeSection === 'effects' && (
            <div className="space-y-4">
              <h3 className="text-white font-medium mb-3">Active Effects</h3>
              <div className="text-sm text-white/60">
                Effect controls will be displayed here based on active effects
              </div>
            </div>
          )}

          {activeSection === 'lighting' && (
            <div className="space-y-4">
              <h3 className="text-white font-medium mb-3">Studio Lighting</h3>
              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-white mb-1">Key Light</div>
                  <div className="text-xs text-white/60">
                    Intensity: {Math.round(studioLighting.keyLight.intensity * 100)}%
                  </div>
                  <div className="text-xs text-white/60">
                    Angle: {Math.round(studioLighting.keyLight.angle)}°
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-white mb-1">Fill Light</div>
                  <div className="text-xs text-white/60">
                    Intensity: {Math.round(studioLighting.fillLight.intensity * 100)}%
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-white mb-1">Rim Light</div>
                  <div className="text-xs text-white/60">
                    Intensity: {Math.round(studioLighting.rimLight.intensity * 100)}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'materials' && (
            <div className="space-y-4">
              <h3 className="text-white font-medium mb-3">Material Properties</h3>
              <div className="text-sm text-white/60">
                Material controls will be displayed here
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Button 
          onClick={onExport}
          className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Card
        </Button>
      </div>
    </div>
  );
};
