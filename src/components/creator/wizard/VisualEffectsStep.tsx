
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Sparkles, Palette, Chrome, Rainbow } from 'lucide-react';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface VisualEffectsStepProps {
  effects: {
    holographic: boolean;
    chrome: boolean;
    foil: boolean;
    intensity: number;
  };
  onEffectsUpdate: (effects: {
    holographic: boolean;
    chrome: boolean;
    foil: boolean;
    intensity: number;
  }) => void;
  selectedTemplate: DesignTemplate | null;
}

export const VisualEffectsStep = ({ effects, onEffectsUpdate, selectedTemplate }: VisualEffectsStepProps) => {
  const handleEffectToggle = (effectType: keyof typeof effects, value: boolean) => {
    onEffectsUpdate({
      ...effects,
      [effectType]: value
    });
  };

  const handleIntensityChange = (value: number[]) => {
    onEffectsUpdate({
      ...effects,
      intensity: value[0]
    });
  };

  const effectOptions = [
    {
      id: 'holographic',
      name: 'Holographic',
      description: 'Rainbow shifting effect that changes with viewing angle',
      icon: Sparkles,
      gradient: 'from-pink-500 via-purple-500 to-cyan-500',
      enabled: effects.holographic
    },
    {
      id: 'chrome',
      name: 'Chrome',
      description: 'Metallic mirror-like finish with reflective properties',
      icon: Chrome,
      gradient: 'from-gray-400 via-gray-300 to-gray-500',
      enabled: effects.chrome
    },
    {
      id: 'foil',
      name: 'Rainbow Foil',
      description: 'Multi-colored foil effect with prismatic reflections',
      icon: Rainbow,
      gradient: 'from-yellow-400 via-pink-500 to-purple-600',
      enabled: effects.foil
    }
  ];

  const hasAnyEffect = effects.holographic || effects.chrome || effects.foil;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Visual Effects</h2>
        <p className="text-crd-lightGray">
          Add stunning visual effects to make your card stand out
        </p>
      </div>

      {/* Effect Options */}
      <div className="space-y-4">
        {effectOptions.map((effect) => {
          const Icon = effect.icon;
          return (
            <div
              key={effect.id}
              className={`p-4 rounded-lg border transition-all ${
                effect.enabled
                  ? 'bg-crd-mediumGray/50 border-crd-green'
                  : 'bg-crd-mediumGray/20 border-crd-mediumGray/50 hover:border-crd-mediumGray'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${effect.gradient} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{effect.name}</h3>
                    <p className="text-crd-lightGray text-sm">{effect.description}</p>
                  </div>
                </div>
                <Switch
                  checked={effect.enabled}
                  onCheckedChange={(checked) => handleEffectToggle(effect.id as keyof typeof effects, checked)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Intensity Slider */}
      {hasAnyEffect && (
        <div className="space-y-3">
          <Label className="text-white font-medium">
            Effect Intensity: {Math.round(effects.intensity * 100)}%
          </Label>
          <div className="px-3">
            <Slider
              value={[effects.intensity]}
              onValueChange={handleIntensityChange}
              max={1}
              min={0.1}
              step={0.1}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-crd-lightGray">
            <span>Subtle</span>
            <span>Intense</span>
          </div>
        </div>
      )}

      {/* Preview Section */}
      <div className="p-4 bg-crd-mediumGray/20 rounded-lg border border-crd-mediumGray/30">
        <div className="flex items-center gap-3 mb-3">
          <Palette className="w-5 h-5 text-crd-green" />
          <span className="text-white font-medium">Effect Preview</span>
        </div>
        
        {hasAnyEffect ? (
          <div className="space-y-2">
            <p className="text-crd-lightGray text-sm">Active effects:</p>
            <div className="flex flex-wrap gap-2">
              {effects.holographic && (
                <span className="px-2 py-1 bg-gradient-to-r from-pink-500 to-cyan-500 text-white text-xs rounded">
                  Holographic
                </span>
              )}
              {effects.chrome && (
                <span className="px-2 py-1 bg-gradient-to-r from-gray-400 to-gray-600 text-white text-xs rounded">
                  Chrome
                </span>
              )}
              {effects.foil && (
                <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-purple-600 text-white text-xs rounded">
                  Rainbow Foil
                </span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-crd-lightGray text-sm">
            Select effects above to see them applied to your card
          </p>
        )}
      </div>

      {/* Quick Presets */}
      <div className="space-y-3">
        <Label className="text-white font-medium">Quick Presets</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            variant="outline"
            onClick={() => onEffectsUpdate({ holographic: false, chrome: false, foil: false, intensity: 0.5 })}
            className="bg-transparent border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray hover:text-white"
          >
            None
          </Button>
          <Button
            variant="outline"
            onClick={() => onEffectsUpdate({ holographic: true, chrome: false, foil: false, intensity: 0.7 })}
            className="bg-transparent border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray hover:text-white"
          >
            Classic Holo
          </Button>
          <Button
            variant="outline"
            onClick={() => onEffectsUpdate({ holographic: true, chrome: true, foil: true, intensity: 0.9 })}
            className="bg-transparent border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray hover:text-white"
          >
            Maximum Shine
          </Button>
        </div>
      </div>
    </div>
  );
};
