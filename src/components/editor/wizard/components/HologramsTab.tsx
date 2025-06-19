
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Rainbow, Sparkles, Gem, Zap } from 'lucide-react';

interface HologramsTabProps {
  surface: {
    holographic: { enabled: boolean; intensity: number; pattern: string };
    prism: { enabled: boolean; dispersion: number; refraction: number };
    foil: { enabled: boolean; type: string; intensity: number };
    interference: { enabled: boolean; frequency: number; amplitude: number };
  };
  onUpdate: (surface: HologramsTabProps['surface']) => void;
}

const HOLOGRAM_PATTERNS = [
  { id: 'rainbow', name: 'Rainbow Shift', icon: Rainbow, description: 'Classic rainbow effect' },
  { id: 'crystal', name: 'Crystal Prism', icon: Gem, description: 'Diamond-like refraction' },
  { id: 'aurora', name: 'Aurora Waves', icon: Sparkles, description: 'Flowing aurora patterns' },
  { id: 'lightning', name: 'Lightning', icon: Zap, description: 'Electric energy patterns' }
];

export const HologramsTab = ({ surface, onUpdate }: HologramsTabProps) => {
  const updateHolographic = (updates: Partial<typeof surface.holographic>) => {
    onUpdate({
      ...surface,
      holographic: { ...surface.holographic, ...updates }
    });
  };

  const updatePrism = (updates: Partial<typeof surface.prism>) => {
    onUpdate({
      ...surface,
      prism: { ...surface.prism, ...updates }
    });
  };

  return (
    <div className="space-y-6">
      {/* Holographic Effects */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white font-medium">Holographic Effects</h4>
          <Button
            onClick={() => updateHolographic({ enabled: !surface.holographic.enabled })}
            variant="outline"
            size="sm"
            className={`${
              surface.holographic.enabled
                ? 'bg-crd-green text-black border-crd-green'
                : 'bg-transparent text-white border-crd-mediumGray'
            }`}
          >
            {surface.holographic.enabled ? 'On' : 'Off'}
          </Button>
        </div>

        {surface.holographic.enabled && (
          <div className="space-y-4">
            {/* Hologram Patterns */}
            <div>
              <Label className="text-sm text-crd-lightGray mb-2 block">Pattern Type</Label>
              <div className="space-y-2">
                {HOLOGRAM_PATTERNS.map((pattern) => {
                  const Icon = pattern.icon;
                  const isActive = surface.holographic.pattern === pattern.id;
                  
                  return (
                    <button
                      key={pattern.id}
                      onClick={() => updateHolographic({ pattern: pattern.id })}
                      className={`w-full p-2 rounded border text-left transition-all ${
                        isActive
                          ? 'border-crd-green bg-crd-green/10 text-white'
                          : 'border-crd-mediumGray bg-crd-mediumGray/10 text-crd-lightGray hover:border-crd-green hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium text-sm">{pattern.name}</span>
                      </div>
                      <p className="text-xs opacity-75">{pattern.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hologram Intensity */}
            <div>
              <Label className="text-sm text-crd-lightGray mb-2 block">
                Hologram Intensity: {Math.round(surface.holographic.intensity)}%
              </Label>
              <Slider
                value={[surface.holographic.intensity]}
                onValueChange={([value]) => updateHolographic({ intensity: value })}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Prism Effects */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white font-medium">Prism Effects</h4>
          <Button
            onClick={() => updatePrism({ enabled: !surface.prism.enabled })}
            variant="outline"
            size="sm"
            className={`${
              surface.prism.enabled
                ? 'bg-crd-green text-black border-crd-green'
                : 'bg-transparent text-white border-crd-mediumGray'
            }`}
          >
            {surface.prism.enabled ? 'On' : 'Off'}
          </Button>
        </div>

        {surface.prism.enabled && (
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-crd-lightGray mb-2 block">
                Light Dispersion: {Math.round(surface.prism.dispersion)}%
              </Label>
              <Slider
                value={[surface.prism.dispersion]}
                onValueChange={([value]) => updatePrism({ dispersion: value })}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-sm text-crd-lightGray mb-2 block">
                Refraction: {Math.round(surface.prism.refraction)}%
              </Label>
              <Slider
                value={[surface.prism.refraction]}
                onValueChange={([value]) => updatePrism({ refraction: value })}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
